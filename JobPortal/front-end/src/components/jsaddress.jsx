import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

Chart.register(...registerables);

const BarChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Address of Jobseekers',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/location-distribution`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const location = await response.json(); 

        const labels = location.map(location => location.location);
        const counts = location.map(location => location.count);

        setChartData({
          labels,
          datasets: [{
            ...chartData.datasets[0],
            data: counts,
          }],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Location Distribution Report', 14, 10);

    // Define table columns and data
    const tableColumn = ["Location", "Count"];
    const tableRows = chartData.labels.map((label, index) => [label, chartData.datasets[0].data[index]]);

    // Add table to PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    // Save the PDF
    doc.save('Location_Distribution_Report.pdf');
  };

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={downloadPDF} 
        style={{ position: 'absolute', top: 0, right: 0 }}
      >
        Download PDF
      </button>
      <Bar 
        data={chartData} 
        options={{
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }} 
      />
    </div>
  );
};

export default BarChart;

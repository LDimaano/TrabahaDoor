import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaDownload } from 'react-icons/fa';

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

  // Dynamically calculate the width based on the number of labels
  const chartWidth = chartData.labels.length * 60;  // 60px per label, adjust as needed

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <FaDownload 
        onClick={downloadPDF} 
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          cursor: 'pointer',
          fontSize: '0.8em', 
          color: '#007bff',  
        }} 
      />
      
      {/* Scrollable container for the chart */}
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <Bar 
          data={chartData} 
          options={{
            maintainAspectRatio: false,
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
              x: {
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 10,
                },
              },
            },
          }} 
          style={{ height: '300px', width: `${chartWidth}px` }} // Dynamically adjust width
        />
      </div>
    </div>
  );
};

export default BarChart;

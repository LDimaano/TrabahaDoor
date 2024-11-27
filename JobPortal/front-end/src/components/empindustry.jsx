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
      label: 'Count of Employers',
      data: [],
      backgroundColor: '#87CEEB', // Sky Blue for bars
      borderColor: '#87CEEB', // Same Sky Blue for borders
      borderWidth: 1,
    }],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/empindustry-distribution`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsindustry = await response.json(); 

        const labels = jsindustry.map(jsindustry => jsindustry.industry_name);
        const counts = jsindustry.map(jsindustry => jsindustry.count);

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
    doc.text('Industry Distribution Report', 14, 10);

    // Define table columns and data
    const tableColumn = ["Industry", "Count"];
    const tableRows = chartData.labels.map((label, index) => [label, chartData.datasets[0].data[index]]);

    // Add table to PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    // Save the PDF
    doc.save('Employer_Industry_Distribution_Report.pdf');
  };

  return (
    <div style={{ position: 'relative', height: '400px' }}>
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
      <Bar 
        data={chartData} 
        options={{
          maintainAspectRatio: false,
          indexAxis: 'y', // This makes the chart horizontal
          scales: {
            x: {
              beginAtZero: true, // Ensure x-axis starts at 0 for horizontal bars
            },
            y: {
              beginAtZero: true,
            },
          },
        }} 
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
};

export default BarChart;

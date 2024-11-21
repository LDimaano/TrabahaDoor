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
      label: 'Count of Jobseekers',
      data: [],
      backgroundColor: [
        '#ADD8E6', // Light Blue
        '#87CEEB', // Sky Blue
        '#1E90FF', // Dodger Blue
        '#4169E1', // Royal Blue
        '#0000CD', // Medium Blue
      ], 
      borderColor: [
        '#ADD8E6', '#87CEEB', '#1E90FF', '#4169E1', '#0000CD',
      ],
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

    const tableColumn = ["Location", "Count"];
    const tableRows = chartData.labels.map((label, index) => [label, chartData.datasets[0].data[index]]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('Location_Distribution_Report.pdf');
  };

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
      <Bar 
        data={chartData} 
        options={{
          maintainAspectRatio: false,
          responsive: true,
          indexAxis: 'y',  
          scales: {
            x: {
              beginAtZero: true,
              title: {
                display: true, // Add label to x-axis
              },
              grid: {
                display: true,  // Enable gridlines for clarity
              },
            },
            y: {
              title: {
                display: true,// Add label to y-axis
              },
              grid: {
                display: true,  // Enable gridlines for clarity
              },
            },
          },
          plugins: {
            legend: {
              display: true,  // Hide legend if not necessary
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  return `Count: ${tooltipItem.raw}`;  // Show count in tooltip
                }
              }
            }
          },
        }} 
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
};

export default BarChart;

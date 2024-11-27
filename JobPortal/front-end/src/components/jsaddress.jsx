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
      backgroundColor: '#4169E1', // Royal Blue for all bars
      borderColor: '#4169E1', // Same Royal Blue for borders
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
                display: true,
              },
              grid: {
                display: true,
              },
            },
            y: {
              title: {
                display: true,
              },
              grid: {
                display: true,
              },
            },
          },
          plugins: {
            legend: {
              display: true,
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  return `Count: ${tooltipItem.raw}`;
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

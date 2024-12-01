import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register all necessary components
Chart.register(...registerables);

const BarChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Applicant Address Distribution',
      data: [],
      backgroundColor: '#1E90FF', // Single color for bars
      borderColor: '#1E90FF', // Single color for borders
      borderWidth: 1,
    }],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = sessionStorage.getItem('user_id');
        if (!userId) {
          throw new Error('User ID not found in session storage');
        }
        
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employers/location-distribution/${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const location = await response.json();

        const labels = location.map(item => item.location);
        const counts = location.map(item => item.count);

        setChartData({
          labels,
          datasets: [{
            label: 'Applicant Address Distribution',
            data: counts,
            backgroundColor: '#1E90FF', // Apply single color
            borderColor: '#1E90FF', // Apply single color
            borderWidth: 1,
          }],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-light border rounded shadow-sm p-4" style={{ height: '400px', width: '100%' }}>
      <h5 className="mb-4 text-center">Applicant Address Distribution</h5>
      <Bar 
        data={chartData} 
        options={{
          responsive: true, // Ensure the chart is responsive
          maintainAspectRatio: false, // Allow the chart to adjust based on container size
          indexAxis: 'y', // Horizontal bar chart
          scales: {
            x: { 
              beginAtZero: true,
              title: {
                display: true,
              },
              maxBarThickness: 20, // Limit the bar width to prevent overflow
            },
            y: { 
              title: {
                display: true,
              },
              ticks: {
                autoSkip: true, // Skip some labels on the y-axis to avoid overlap
              },
            },
          },
          plugins: {
            legend: {
              position: 'top', // Position the legend at the top to avoid crowding
            },
          },
          layout: {
            padding: {
              top: 10,
              left: 10,
              right: 10,
              bottom: 10, // Add padding to ensure the content fits
            },
          },
        }} 
      />
    </div>
  );
};

export default BarChart;

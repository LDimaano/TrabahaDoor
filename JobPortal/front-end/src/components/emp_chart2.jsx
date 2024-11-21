import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register all necessary components
Chart.register(...registerables);

const BarChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Industries of Applicants',
      data: [],
      backgroundColor: [
        '#ADD8E6', // Light Blue
        '#87CEEB', // Sky Blue
        '#4682B4', // Steel Blue
        '#5F9EA0', // Cadet Blue
        '#1E90FF', // Dodger Blue
      ],
      borderColor: [
        '#87CEFA', // Lighter Sky Blue
        '#4682B4', // Steel Blue
        '#1E90FF', // Dodger Blue
        '#5F9EA0', // Cadet Blue
        '#ADD8E6', // Light Blue
      ],
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
        
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employers/industry-distribution/${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const industries = await response.json(); // Assuming the response is in JSON format

        const labels = industries.map(industry => industry.industry_name);
        const counts = industries.map(industry => industry.count);

        setChartData({
          labels,
          datasets: [{
            ...chartData.datasets[0],
            data: counts,
            backgroundColor: counts.map((_, i) => {
              // Cycle through blue shades dynamically
              const shades = ['#ADD8E6', '#87CEEB', '#4682B4', '#5F9EA0', '#1E90FF'];
              return shades[i % shades.length];
            }),
            borderColor: counts.map((_, i) => {
              // Match border color with dynamic shades
              const borders = ['#87CEFA', '#4682B4', '#1E90FF', '#5F9EA0', '#ADD8E6'];
              return borders[i % borders.length];
            }),
          }],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div
  className="d-flex flex-column align-items-center bg-light border rounded shadow-sm p-4"
  style={{
    height: "100%", // Allow the parent container to control height
    minHeight: "320px", // Prevent the chart from collapsing
  }}
>
      <h5 className="mb-4 text-center">Industries of Applicants</h5> {/* Title added */}
      <Bar 
        data={chartData} 
        options={{
          indexAxis: 'y', // Switch to horizontal bar chart
          maintainAspectRatio: false,
          scales: {
            x: { // For horizontal bars, the x-axis is now the "value" axis
              beginAtZero: true,
            },
          },
        }} 
      />
    </div>
  );
};

export default BarChart;

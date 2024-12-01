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
      backgroundColor: '#1E90FF', // Dodger Blue
      borderColor: '#1E90FF', // Dodger Blue
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
      <h5 className="mb-4 text-center">Industries of Applicants</h5>
      <Bar 
        data={chartData} 
        options={{
          indexAxis: 'y', // Horizontal bar chart
          maintainAspectRatio: true, // Maintain aspect ratio for responsiveness
          responsive: true, // Make chart responsive
          scales: {
            x: { 
              beginAtZero: true,
              maxBarThickness: 30, // Limit the width of the bars to prevent overflow
            },
          },
        }} 
      />
    </div>
  );
};

export default BarChart;

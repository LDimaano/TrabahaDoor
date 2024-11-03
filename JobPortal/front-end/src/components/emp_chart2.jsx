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
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
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
    <div className="bg-light border rounded shadow-sm p-4" style={{ height: '250px' }}>
      <Bar data={chartData} options={{
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      }} />
    </div>
  );
};

export default BarChart;
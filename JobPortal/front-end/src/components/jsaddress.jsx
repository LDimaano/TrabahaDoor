import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

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

  return (
    <Bar data={chartData} options={{
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    }} />
  );
};

export default BarChart;

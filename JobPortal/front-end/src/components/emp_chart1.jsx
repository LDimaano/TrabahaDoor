import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const ChartPlaceholder1 = () => {
  const [chartData, setChartData] = useState({
    labels: ['Female', 'Male'], 
    datasets: [
      {
        data: [0, 0], 
        backgroundColor: [
          '#FF6384', 
          '#36A2EB', ],
        hoverBackgroundColor: [
          '#FF6384', 
          '#36A2EB', 
        ],
      },
    ],
  });

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const userId = sessionStorage.getItem('user_id');
        if (!userId) {
          throw new Error('User ID not found in session storage');
        }
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employers/gender-distribution/${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();

        const genders = data.map(item => item.gender);
        const counts = data.map(item => item.count);

        setChartData({
          labels: genders,
          datasets: [
            {
              data: counts,
              backgroundColor: [
                '#ADD8E6', 
                '#87CEEB', 
              ],
              hoverBackgroundColor: [
                '#B0E0E6', 
                '#5F9EA0', 
              ],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, []);

  return (
    <div
      className="bg-light border rounded shadow-sm p-4 text-center"
      style={{
        height: "320px",
        overflow: "hidden", // Prevents content from overflowing
      }}
    >
      <h5 className="mb-4">Applicant Gender Distribution</h5>
      <Pie
        data={chartData}
        options={{
          maintainAspectRatio: true, // Preserves the aspect ratio of the chart
          responsive: true, // Ensures the chart resizes with the container
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
        }}
      />
    </div>
  ); 
};

export default ChartPlaceholder1;

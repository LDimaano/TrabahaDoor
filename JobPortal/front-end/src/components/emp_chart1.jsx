import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ChartPlaceholder1 = () => {
  const [chartData, setChartData] = useState({
    labels: ['Female', 'Male'], // Ensure you have labels for both genders
    datasets: [
      {
        data: [0, 0], // Default to 0 to avoid errors on empty data
        backgroundColor: [
          '#FF6384', // Red
          '#36A2EB', // Blue
        ],
        hoverBackgroundColor: [
          '#FF6384', // Red
          '#36A2EB', // Blue
        ],
      },
    ],
  });

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        // Retrieve user_id from sessionStorage
        const userId = sessionStorage.getItem('user_id');
        if (!userId) {
          throw new Error('User ID not found in session storage');
        }

        // Fetch data from API with user_id in query string
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employers/gender-distribution/${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();

        // Map the response data to the labels and data for the chart
        const genders = data.map(item => item.gender);
        const counts = data.map(item => item.count);

        // Update the chartData state with the fetched data
        setChartData({
          labels: genders,
          datasets: [
            {
              data: counts,
              backgroundColor: [
                '#ADD8E6', // Light Blue
                '#87CEEB', // Sky Blue
              ],
              hoverBackgroundColor: [
                '#B0E0E6', // Powder Blue
                '#5F9EA0', // Cadet Blue
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
    <div className="bg-light border rounded shadow-sm p-4 text-center" style={{ height: '320px' }}> {/* Adjust height */}
      <h5 className="mb-4">Applicant Gender Distribution</h5> {/* Add title */}
      <Pie 
        data={chartData} 
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top', // Place legend at the top
            },
          },
        }} 
      />
    </div>
  );
};

export default ChartPlaceholder1;

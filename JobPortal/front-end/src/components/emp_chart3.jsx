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
      backgroundColor: [],
      borderColor: [],
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

        // Define shades of blue for dynamic styling
        const shadesOfBlue = ['#ADD8E6', '#87CEEB', '#4682B4', '#5F9EA0', '#1E90FF'];

        setChartData({
          labels,
          datasets: [{
            label: 'Applicant Address Distribution',
            data: counts,
            backgroundColor: counts.map((_, i) => shadesOfBlue[i % shadesOfBlue.length]), // Cycle shades of blue
            borderColor: counts.map((_, i) => shadesOfBlue[i % shadesOfBlue.length]), // Match borders
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
    <div
  className="d-flex flex-column align-items-center bg-light border rounded shadow-sm p-4"
  style={{
    height: "100%", // Allow the parent container to control height
    minHeight: "320px", // Prevent the chart from collapsing
  }}
>
      <h5 className="mb-4 text-center">Applicant Address Distribution</h5> {/* Title added */}
      <Bar 
        data={chartData} 
        options={{
          indexAxis: 'y', // Switch to horizontal bar chart
          maintainAspectRatio: false,
          scales: {
            x: { // For horizontal bars, the x-axis is now the "value" axis
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Applicants',
              },
            },
            y: { // The y-axis shows the locations (categories)
              title: {
                display: true,
                text: 'Applicant Locations',
              },
            },
          },
        }} 
      />
    </div>
  );
};

export default BarChart;

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register all necessary components
Chart.register(...registerables);

const BarChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Number of Applicants',
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
        
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employers/applicants-distribution/${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const applicants = await response.json();

        const labels = applicants.map(applicant => applicant.job_title);
        const counts = applicants.map(applicant => applicant.count);

        // Define shades of blue for dynamic styling
        const shadesOfBlue = ['#ADD8E6', '#87CEEB', '#4682B4', '#5F9EA0', '#1E90FF'];

        setChartData({
          labels,
          datasets: [{
            label: 'Number of Applicants',
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
    <div className="bg-light border rounded shadow-sm p-4" style={{ height: '400px', width: '100%' }}>
      <h5 className="mb-4 text-center">Job Title of Applicants</h5>
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

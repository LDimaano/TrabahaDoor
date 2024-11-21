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
    <div className="bg-light border rounded shadow-sm p-4" style={{ height: '400px' }}> {/* Increased height for better layout */}
      <h5 className="mb-4 text-center">Job Title of Applicants</h5> {/* Chart Title */}
      <Bar 
        data={chartData} 
        options={{
          indexAxis: 'y', // Switch to horizontal bar chart
          maintainAspectRatio: false,
          scales: {
            x: { // The x-axis for values
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Applicants',
              },
            },
            y: { // The y-axis for job titles
              title: {
                display: true,
                text: 'Job Titles',
              },
            },
          },
        }} 
      />
    </div>
  );
};

export default BarChart;

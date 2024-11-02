import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';

const ChartPlaceholder1 = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Customize colors as needed
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
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
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
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
    <div className="bg-light border rounded shadow-sm p-4 text-center" style={{ height: '250px' }}>
      <Pie data={chartData} options={{ maintainAspectRatio: false }} />
    </div>
  );
};

export default ChartPlaceholder1;

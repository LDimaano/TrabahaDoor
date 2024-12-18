import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaDownload } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const GenderDistributionChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/gender-distribution`);
        const data = await response.json();

        const labels = data.map(item => item.gender);
        const counts = data.map(item => item.count);

        setChartData({
          labels,
          datasets: [
            {
              data: counts,
              backgroundColor: [
                '#87CEEB', // Sky Blue
                '#4169E1', // Royal Blue
                '#0000CD', // Medium Blue
              ],
              hoverBackgroundColor: ['#87CEEB', '#4169E1', '#0000CD'],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Gender Distribution Report', 14, 10);

    // Define table columns and data
    const tableColumn = ['Gender', 'Count'];
    const tableRows = chartData.labels.map((label, index) => [
      label,
      chartData.datasets[0].data[index],
    ]);

    // Add table to PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    // Save the PDF
    doc.save('Gender_Distribution_Report.pdf');
  };

  return (
    <div style={{ position: 'relative' }}>
      {chartData ? (
        <>
          <FaDownload 
            onClick={downloadPDF} 
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              cursor: 'pointer',
              fontSize: '0.8em', 
              color: '#007bff',  
            }} 
          />
          <Pie 
            data={chartData} 
            options={{
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    color: 'black', // Label color
                  },
                },
                tooltip: {
                  callbacks: {
                    label: function (tooltipItem) {
                      const dataIndex = tooltipItem.dataIndex;
                      const count = chartData.datasets[0].data[dataIndex];
                      return `${tooltipItem.label}: ${count}`;
                    },
                  },
                },
                datalabels: {
                  formatter: (value) => value, // Display the count directly
                  color: 'white',
                  font: {
                    weight: 'bold',
                    size: 12,
                  },
                },
              },
            }} 
          />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default GenderDistributionChart;

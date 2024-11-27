import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaDownload } from 'react-icons/fa';

Chart.register(...registerables);

const BarChart = () => {
  const [originalData, setOriginalData] = useState([]); // Store the full dataset
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Count of Jobseekers',
      data: [],
      backgroundColor: '#1E90FF', // Single color for bars (Dodger Blue)
      borderColor: '#1E90FF', // Matching border color
      borderWidth: 1,
    }],
  });
  const [filter, setFilter] = useState('all'); // Default filter is "all"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/jsindustry-distribution`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsindustry = await response.json();

        setOriginalData(jsindustry); // Store the raw data
        updateChartData(jsindustry); // Initialize the chart with all data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const updateChartData = (data) => {
    const labels = data.map(item => item.industry_name);
    const counts = data.map(item => item.count);

    setChartData({
      labels,
      datasets: [{
        ...chartData.datasets[0],
        data: counts,
      }],
    });
  };

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);

    let filteredData = originalData;

    if (selectedFilter === 'high') {
      filteredData = originalData.filter(item => item.count > 10); // Example: Show industries with count > 50
    } else if (selectedFilter === 'low') {
      filteredData = originalData.filter(item => item.count <= 10); // Example: Show industries with count <= 50
    }

    updateChartData(filteredData);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Jobseeker Industry Distribution Report', 14, 10);

    const tableColumn = ["Industry", "Count"];
    const tableRows = chartData.labels.map((label, index) => [label, chartData.datasets[0].data[index]]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('Jobseeker_Industry_Distribution_Report.pdf');
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Dropdown Filter */}
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <label htmlFor="filter" style={{ marginRight: '10px', fontWeight: 'bold' }}>Filter By Count:</label>
        <select id="filter" value={filter} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="high">High Count (&gt; 50)</option>
          <option value="low">Low Count (&le; 50)</option>
        </select>
      </div>

      {/* Download Button */}
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

      {/* Bar Chart */}
      <Bar
        data={chartData}
        options={{
          maintainAspectRatio: false,
          indexAxis: 'y', // Horizontal bars
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
            },
          },
        }}
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
};

export default BarChart;

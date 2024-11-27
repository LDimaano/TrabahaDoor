import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaDownload } from 'react-icons/fa';

const BarChartComponent = () => {
  const [originalData, setOriginalData] = useState([]); // Store the full dataset
  const [filter, setFilter] = useState('all'); // Default filter is "all"
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/empindustry-distribution`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsindustry = await response.json();
        setOriginalData(jsindustry); // Store the raw data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const updateChartData = () => {
    let filteredData = originalData;

    if (filter === 'high') {
      filteredData = originalData.filter(item => item.count > 10); // Filter industries with count > 10
    } else if (filter === 'low') {
      filteredData = originalData.filter(item => item.count <= 10); // Filter industries with count <= 10
    }

    return filteredData;
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Employer Industry Distribution Report', 14, 10);

    const tableColumn = ["Industry", "Count"];
    const tableRows = originalData.map((item) => [item.industry_name, item.count]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('Employer_Industry_Distribution_Report.pdf');
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Dropdown Filter */}
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <label htmlFor="filter" style={{ marginRight: '10px', fontWeight: 'bold' }}>Filter By Count:</label>
        <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="high">High Count (&gt; 10)</option>
          <option value="low">Low Count (&le; 10)</option>
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
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={updateChartData()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="industry_name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#87CEEB" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaDownload } from 'react-icons/fa';

const BarChartComponent = () => {
  const [originalData, setOriginalData] = useState([]); // Store the full dataset
  const [filter, setFilter] = useState('all'); // Default count filter
  const [industries, setIndustries] = useState([]); // Store unique industries
  const [selectedIndustry, setSelectedIndustry] = useState('all'); // Default industry filter

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/jsindustry-distribution`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsindustry = await response.json();
        setOriginalData(jsindustry); // Store the raw data

        // Extract unique industries
        const uniqueIndustries = [...new Set(jsindustry.map(item => item.industry_name))];
        setIndustries(uniqueIndustries);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const updateChartData = () => {
    let filteredData = originalData;

    // Apply industry filter
    if (selectedIndustry !== 'all') {
      filteredData = filteredData.filter(item => item.industry_name === selectedIndustry);
    }

    // Apply count filter
    if (filter === 'high') {
      filteredData = filteredData.filter(item => item.count > 10); // Filter industries with count > 10
    } else if (filter === 'low') {
      filteredData = filteredData.filter(item => item.count <= 10); // Filter industries with count <= 10
    }

    return filteredData;
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Jobseeker Industry Distribution Report', 14, 10);

    const tableColumn = ["Industry", "Count"];
    const tableRows = originalData.map((item) => [item.industry_name, item.count]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('Jobseeker_Industry_Distribution_Report.pdf');
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Dropdown Filters */}
      <div style={{ marginBottom: '1rem', textAlign: 'center', fontSize: '0.85em' }}>
        {/* Count Filter */}
        <label htmlFor="filter" style={{ marginRight: '5px', fontWeight: 'bold' }}>Count:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            marginRight: '15px',
            padding: '2px 5px',
            fontSize: '0.85em',
            width: '110px',
          }}
        >
          <option value="all">All</option>
          <option value="high">High (&gt; 10)</option>
          <option value="low">Low (&le; 10)</option>
        </select>

        {/* Industry Filter */}
        <label htmlFor="industry" style={{ marginRight: '5px', fontWeight: 'bold' }}>Industry:</label>
        <select
          id="industry"
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          style={{
            padding: '2px 5px',
            fontSize: '0.85em',
            width: '130px',
          }}
        >
          <option value="all">All</option>
          {industries.map((industry, index) => (
            <option key={index} value={industry}>{industry}</option>
          ))}
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
          <Bar dataKey="count" fill="#1E90FF" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;

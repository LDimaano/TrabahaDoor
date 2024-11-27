import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaDownload } from 'react-icons/fa';

const BarChartComponent = () => {
  const [originalData, setOriginalData] = useState([]); // Store the full dataset

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/jsindustry-distribution`);
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
        <BarChart data={originalData}>
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

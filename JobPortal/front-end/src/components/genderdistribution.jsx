import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaDownload } from 'react-icons/fa';

const GenderDistributionChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/gender-distribution`);
        const data = await response.json();

        console.log("Fetched Data:", data); // Log fetched data to check structure

        const formattedData = data.map(item => ({
          name: item.gender,
          value: item.count,
        }));

        console.log("Formatted Data:", formattedData); // Log formatted data

        setChartData(formattedData);
        setLoading(false); // Set loading to false once data is loaded
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchData();
  }, []);

  // Colors for the pie chart
  const COLORS = ['#87CEEB', '#4169E1', '#0000CD'];

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Gender Distribution Report', 14, 10);

    // Define table columns and data
    const tableColumn = ["Gender", "Count"];
    const tableRows = chartData.map(item => [item.name, item.value]);

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
      {loading ? (
        <p>Loading...</p> // Show loading text while data is being fetched
      ) : (
        <>
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

          {/* Pie Chart */}
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie 
                data={chartData} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius="80%" 
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default GenderDistributionChart;

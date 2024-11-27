import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaDownload } from 'react-icons/fa';

const GenderDistributionChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/gender-distribution`);
        const data = await response.json();

        const formattedData = data.map(item => ({
          name: item.gender,
          value: item.count,
        }));

        setChartData(formattedData);
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

  const COLORS = ['#87CEEB', '#4169E1', '#0000CD']; // Sky Blue, Royal Blue, Medium Blue

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
          <PieChart width={400} height={400}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={150}
              fill="#8884d8"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default GenderDistributionChart;

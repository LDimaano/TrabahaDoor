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
        
        console.log("Fetched data:", data);  // Log to check the data format

        if (Array.isArray(data) && data.length > 0) {
          const formattedData = data.map(item => ({
            name: item.gender,
            value: item.count,
          }));
          setChartData(formattedData);
        } else {
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Gender Distribution Report', 14, 10);

    const tableColumn = ["Gender", "Count"];
    const tableRows = chartData.map(item => [item.name, item.value]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('Gender_Distribution_Report.pdf');
  };

  const COLORS = ['#87CEEB', '#4169E1', '#0000CD']; // Define colors for the pie chart

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      {chartData && chartData.length > 0 ? (
        <>
          {/* Download button */}
          <FaDownload
            onClick={downloadPDF}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              cursor: 'pointer',
              fontSize: '0.8em',
              color: '#007bff',
              zIndex: 1, // Ensure the button stays on top
            }}
          />
          {/* Pie Chart */}
          <PieChart width={400} height={400}> {/* Explicitly set width and height */}
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={150} // You can try adjusting this to 100 or 180
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
        <p>Loading...</p> // Show loading text while fetching data
      )}
    </div>
  );
};

export default GenderDistributionChart;

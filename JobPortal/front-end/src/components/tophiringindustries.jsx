import React, { useEffect, useState } from 'react';
import { FaDownload } from 'react-icons/fa'; // Importing the download icon
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'bootstrap/dist/css/bootstrap.min.css';

function TopHiringList({ title }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopIndustries = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/topindustries`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const items = await response.json();

        // Check if data is not empty
        if (items && items.length > 0) {
          setItems(items);
        }
      } catch (error) {
        setError(error.message);
        console.error('Error fetching employers:', error);
      }
    };

    fetchTopIndustries();
  }, []);

  const generatePDFReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Top Hiring Industries Report', 20, 20);
    doc.setFontSize(12);
    doc.text('List of industries with the highest number of job postings', 20, 30);

    const tableData = items.map((item) => [item.industry_name, item.job_count]);

    doc.autoTable({
      head: [['Industry Name', 'Job Count']],
      body: tableData,
      startY: 40,
    });

    doc.save('TopHiringIndustriesReport.pdf');
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Limit display to top 5 items
  const displayedItems = items.slice(0, 5);

  return (
    <section className="card p-3 shadow-sm position-relative"> {/* Added position-relative */}
      <h2 className="h6 text-dark">{title}</h2>

      {/* Download icon positioned to the top right */}
      <FaDownload
        className="position-absolute"
        style={{ top: '15px', right: '15px', cursor: 'pointer', color: '#007bff' }}
        onClick={generatePDFReport}
      />

      <ul className="list-unstyled mt-2">
        {displayedItems.map((item, index) => (
          <li key={index} className="d-flex align-items-center justify-content-between mb-2">
            <span className="text-dark flex-grow-1">{item.industry_name}</span>
            <span className="fw-bold">{item.job_count}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TopHiringList;

import React, { useEffect, useState } from 'react';
import { Tooltip, OverlayTrigger, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

function BarChart() {
  const [timeToFillData, setTimeToFillData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userId = sessionStorage.getItem('user_id');
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/applicants/timetofillemp/${userId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTimeToFillData(data);
      } catch (error) {
        console.error('Error fetching time to fill data:', error);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const jobTitles = Object.keys(timeToFillData)
    .map((job_title) => ({
      name: job_title,
      height: timeToFillData[job_title] || 0,
    }))
    .sort((a, b) => b.height - a.height);

  const generatePDFReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Time to Fill Analysis Report', 20, 20);
    doc.setFontSize(12);
    doc.text('Average Time to Fill per Job Title', 20, 30);

    const tableData = jobTitles.map((job_title) => [job_title.name, `${job_title.height} days`]);

    doc.autoTable({
      head: [['Job Title', 'Average Time to Fill (days)']],
      body: tableData,
      startY: 40,
    });

    doc.save('TimeToFillReport.pdf');
  };

  // Calculate max height to normalize the bar height for scaling
  const maxHeight = Math.max(...jobTitles.map((job_title) => job_title.height));
  const maxBarHeight = 200; // Max bar height in pixels
  
  // Calculate the width of each bar based on the number of job titles
  const barWidth = 100 / jobTitles.length; // Percentage width based on the number of bars

  return (
    <section className="card border-light shadow-sm p-4">
      <header className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="h4 text-dark">Time to Fill Analysis</h2>
          <p className="text-muted">Showing Average Time to Fill per Job Title</p>
        </div>
        <Button variant="primary" onClick={generatePDFReport}>
          <FontAwesomeIcon icon={faDownload} className="me-2" />
          Export Data
        </Button>
      </header>

      {error && <div className="alert alert-danger">{error}</div>}

      <nav className="nav nav-tabs mb-4">
        <button className="nav-link active" aria-current="page">
          Time to Fill
        </button>
      </nav>

      {/* Bar chart container with flexbox for alignment */}
      <div
        className="d-flex justify-content-between align-items-end"
        style={{
          height: `${maxBarHeight + 50}px`, // Increased height for better visibility
          width: '100%',
          overflow: 'hidden',
          marginBottom: '20px',
        }}
      >
        {jobTitles.map((job_title, index) => {
          const barHeight = (job_title.height / maxHeight) * maxBarHeight; // Normalize the height to the max value

          return (
            <div
              key={index}
              className="text-center"
              style={{
                flex: 1,
                margin: '0 10px', // Added spacing between bars
                display: 'flex',
                flexDirection: 'column', // Make sure the text is centered below the bar
                alignItems: 'center',
                width: `${barWidth}%`, // Dynamically set the width of the bar
              }}
            >
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>{`${job_title.height} days`}</Tooltip>}
              >
                <div
                  className="position-relative"
                  style={{
                    height: `${barHeight}px`, // Dynamic bar height based on the time to fill
                    backgroundColor: 'blue',
                    border: '2px solid rgba(0, 0, 123, 0.5)',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                ></div>
              </OverlayTrigger>
              {/* <span className="text-muted d-block mt-2">{job_title.name}</span> */}
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="d-flex justify-content-between" style={{ width: '100%' }}>
        {jobTitles.map((job_title, index) => (
          <div key={index} className="text-center" style={{ flex: 1 }}>
            <span className="text-muted">{job_title.name}</span>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="d-flex align-items-center">
          <div
            className="bg-primary"
            style={{ width: '16px', height: '16px', borderRadius: '3px', marginRight: '8px' }}
          ></div>
          <span className="text-muted">Days</span>
        </div>
      </div>
    </section>
  );
}

export default BarChart;

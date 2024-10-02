import React, { useEffect, useState } from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function BarChart() {
  const [timeToFillData, setTimeToFillData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/timetofillemp', {
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

  const industries = Object.keys(timeToFillData)
    .map((industry) => ({
      name: industry,
      height: timeToFillData[industry] || 0,
    }))
    .sort((a, b) => b.height - a.height); // Sort in descending order by height (days)

  return (
    <section className="card border-light shadow-sm p-4">
      <header className="mb-4">
        <h2 className="h4 text-dark">Time to Fill Analysis</h2>
        <p className="text-muted">Showing Average Time to Fill per Industry</p>
      </header>

      {error && <div className="alert alert-danger">{error}</div>}

      <nav className="nav nav-tabs mb-4">
        <button className="nav-link active" aria-current="page">Time to Fill</button>
      </nav>

      <div className="d-flex justify-content-between">
        {industries.map((industry, index) => (
          <div key={index} className="text-center">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>{`${industry.height} days`}</Tooltip>}
            >
              <div
                className="position-relative"
                style={{
                  height: `${industry.height}px`,
                  width: '48px',
                  cursor: 'pointer',
                  backgroundColor: 'blue',
                  border: '2px solid rgba(0, 0, 123, 0.5)',
                  borderRadius: '5px',
                }}
              ></div>
            </OverlayTrigger>
            <span className="text-muted d-block mt-2">{industry.name}</span>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="d-flex align-items-center">
          <div className="bg-primary" style={{ width: '16px', height: '16px', borderRadius: '3px', marginRight: '8px' }}></div>
          <span className="text-muted">Days</span>
        </div>
      </div>
    </section>
  );
}

export default BarChart;
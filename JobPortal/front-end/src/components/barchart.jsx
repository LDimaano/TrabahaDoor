import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Ensure this is imported for tooltips

function BarChart() {
  const [timeToFillData, setTimeToFillData] = useState({});
  const [error, setError] = useState(null); // State to hold any error messages

  useEffect(() => {
    // Fetch data
    fetch('http://localhost:5000/api/timetofill')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setTimeToFillData(data))
      .catch((error) => {
        console.error('Error fetching time to fill data:', error);
        setError(error.message); // Set error message for display
      });
      
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new window.bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, []); // Empty dependency array means this runs once after the initial render

  // Prepare industries data
  const industries = Object.keys(timeToFillData).map((industry) => ({
    name: industry,
    height: timeToFillData[industry] || 0,
  }));

  return (
    <section className="card border-light shadow-sm p-4">
      <style>
        {`
          .tooltip-custom {
            background-color: rgba(0, 123, 255, 0.9); /* Semi-transparent blue */
            color: white; /* White text */
            border-radius: 4px; /* Rounded corners */
            padding: 8px 12px; /* Padding around the text */
            font-size: 14px; /* Font size */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Shadow for depth */
            border: 1px solid rgba(0, 0, 0, 0.1); /* Light border */
          }
        `}
      </style>

      <header className="mb-4">
        <h2 className="h4 text-dark">Time to Fill Analysis</h2>
        <p className="text-muted">Showing Average Time to Fill per Industry</p>
      </header>

      {/* Display error message if there is one */}
      {error && <div className="alert alert-danger">{error}</div>}

      <nav className="nav nav-tabs mb-4">
        <button className="nav-link active" aria-current="page">Time to Fill</button>
      </nav>

      <div className="d-flex justify-content-between">
        {industries.map((industry, index) => (
          <div key={index} className="text-center">
            <div
              className="position-relative"
              style={{
                height: `${industry.height}px`,
                width: '48px',
                cursor: 'pointer',
                backgroundColor: 'blue', // Base color
                transition: 'background-color 0.3s ease, transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 123, 255, 0.8)'; // Lighter blue
                e.currentTarget.style.transform = 'scale(1.1)'; // Scale up on hover
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Add shadow
                e.currentTarget.style.zIndex = '1'; // Bring the hovered bar in front
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'blue'; // Reset color
                e.currentTarget.style.transform = 'scale(1)'; // Reset scale
                e.currentTarget.style.boxShadow = 'none'; // Remove shadow
                e.currentTarget.style.zIndex = '0'; // Reset z-index
              }}
              data-bs-toggle="tooltip" // This enables Bootstrap tooltips
              data-bs-placement="top" // Positioning of the tooltip
              data-bs-custom-class="tooltip-custom" // Custom tooltip class
              title={`${industry.height} days`} // This sets the tooltip content
            ></div>
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

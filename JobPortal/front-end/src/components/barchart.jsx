import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function BarChart() {
  const industries = [
    { name: 'Agri', height: 232 },
    { name: 'Tour', height: 132 },
    { name: 'Educ', height: 48 },
    { name: 'Retail', height: 222 },
    { name: 'IT', height: 198 },
    { name: 'Engr', height: 87 },
    { name: 'Fin', height: 109 }
  ];

  return (
    <section className="card border-light shadow-sm p-4">
      <header className="mb-4">
        <h2 className="h4 text-dark">Time to Fill Analysis</h2>
        <p className="text-muted">Showing Time to Fill Analysis per Category</p>
      </header>

      <nav className="nav nav-tabs mb-4">
        <button className="nav-link active" aria-current="page">Overview</button>
        <button className="nav-link">Tab 2</button>
        <button className="nav-link">Tab 3</button>
      </nav>

      <div className="d-flex justify-content-between">
        {industries.map((industry, index) => (
          <div key={index} className="text-center">
            <div className="bg-primary" style={{ height: `${industry.height}px`, width: '48px' }}></div>
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

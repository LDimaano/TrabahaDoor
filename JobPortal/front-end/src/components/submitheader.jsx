import React from 'react';

const JobHeader = ({ logo, title, company, location, jobType }) => {
  return (
    <header className="mb-4">
      <div className="d-flex align-items-center mb-3">
        <img src={logo} alt={`${company} logo`} className="me-3" style={{ width: '100px', height: '100px' }} />
        <div>
          <h1 className="h3 mb-2 text-start">{title}</h1>
          <div className="text-muted text-start">
            <span className="me-3">{company}</span>
            <span className="me-3">{location}</span>
            <span>{jobType}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default JobHeader;

import React from 'react';
import { useNavigate } from 'react-router-dom';

function JobListItem({ job }) {
  const navigate = useNavigate();

  const handleApplyClick = () => {
    // Navigate to the job description page; you can pass job ID or other details as needed
    navigate(`/jobdescription/${job.jobid}`); // Assuming you'll use job_id for dynamic routing
  };

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div className="d-flex">
        <img
          src={job.logo || 'default-logo-url.png'} // Provide a default if no logo is available
          alt={`${job.Industry} logo`} // Use Industry or any relevant field if company is not available
          width="50"
          height="50"
          className="me-3"
        />
        <div>
          <h5>{job.JobTitle}</h5> {/* Updated to match JobTitle from the database */}
          <p>{job.Industry}</p> {/* Adjust based on available data */}
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleApplyClick}>
        Apply
      </button>
    </li>
  );
}

export default JobListItem;

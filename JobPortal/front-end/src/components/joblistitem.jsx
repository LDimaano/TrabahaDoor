import React from 'react';
import { useNavigate } from 'react-router-dom';

function JobListItem({ job }) {
  const navigate = useNavigate();

  const handleApplyClick = () => {
    // Navigate to the job description page with dynamic job ID
    navigate(`/jobdescription/${job.job_id}`);
  };
  
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div className="d-flex">
        <img
          src={job.profile_picture_url || 'default-logo-url.png'}
          alt={`${job.industry_name} logo`}
          className="rounded-circle me-3"
          width="50"
          height="50"
        />
        <div>
          <h5>{job.job_title}</h5>
          <p>{job.industry_name}</p>
          <p>{job.salaryrange}</p> {/* Add SalaryRange for more details */}
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleApplyClick}>
        Apply
      </button>
    </li>
  );
}

export default JobListItem;

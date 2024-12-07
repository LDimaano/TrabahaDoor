import React from 'react';
import { useNavigate } from 'react-router-dom';
import Tag from './jstag'; 

function JobListItem({ job }) {
  const navigate = useNavigate();

  const handleApplyClick = () => {
    navigate(`/jobdescription/${job.job_id}`);
  };

  const itemStyle = {
    marginBottom: '0.5rem', 
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
          <h5 style={itemStyle}>{job.job_title}</h5>
          <h6 style={itemStyle}>{job.company_name}</h6> 
          <p style={itemStyle}>{job.industry_name}</p>
          <p style={itemStyle}>{job.salaryrange}</p> 
          <Tag>{job.jobtype}</Tag> 
          <p>Match Percentage: <strong>{job.match_percentage}%</strong>
</p>

        </div>
      </div>
      <button className="btn btn-primary" onClick={handleApplyClick}>
        Apply
      </button>
    </li>
  );
}

export default JobListItem;

import React from 'react';
import { useNavigate } from 'react-router-dom';

function JobListItem({ job }) {
  const navigate = useNavigate();

  const handleApplyClick = () => {
    navigate('/jobdescription');
  };

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div className="d-flex">
        <img
          src={job.logo}
          alt={`${job.company} logo`}
          width="50"
          height="50"
          className="me-3"
        />
        <div>
          <h5>{job.title}</h5>
          <p>{job.company} - {job.location}</p>
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleApplyClick}>
        Apply
      </button>
    </li>
  );
}

export default JobListItem;

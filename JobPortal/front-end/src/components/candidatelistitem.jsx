import React from 'react';
import { useNavigate } from 'react-router-dom';

function ApplicantListItem({ applicant }) {
  const navigate = useNavigate();

  const handleApplyClick = () => {
    navigate('/appdetails');
  };

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div className="d-flex">
        <img
          src={applicant.profilePicture}
          alt={`${applicant.name} profile`}
          width="50"
          height="50"
          className="me-3"
        />
        <div>
          <h5>{applicant.name}</h5>
          <p>{applicant.jobTitle} at {applicant.company}</p>
          <p>{applicant.location}</p>
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleApplyClick}>
        View Details
      </button>
    </li>
  );
}

export default ApplicantListItem;

import React from 'react';
import { useNavigate } from 'react-router-dom';

function ApplicantListItem({ applicant }) {
  const navigate = useNavigate();

  const handleApplyClick = () => {
    // Navigate to the job description page with dynamic jsid
    navigate(`/appdetails/${applicant.jsid}`);
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
          <h5>{applicant.full_name}</h5>
          <p>{applicant.email}</p>
          <p>{applicant.address}</p>
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleApplyClick}>
        View Details
      </button>
    </li>
  );
}

export default ApplicantListItem;

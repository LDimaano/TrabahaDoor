import React from 'react';
import { useNavigate } from 'react-router-dom';

function ApplicantListItem({ applicant }) {
  const navigate = useNavigate();

  const handleViewDetailsClick = () => {
    // Navigate to the applicant's profile page using their user_id
    navigate(`/applicant_profile/${applicant.user_id}`);
  };

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div className="d-flex">
        <img
          src={applicant.profilePicture}
          alt={`${applicant.full_name} profile`}
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
      <button className="btn btn-primary" onClick={handleViewDetailsClick}>
        View Details
      </button>
    </li>
  );
}

export default ApplicantListItem;

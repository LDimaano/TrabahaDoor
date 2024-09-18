import React from 'react';
import { useNavigate } from 'react-router-dom';


function ApplicantListItem({ applicant }) {
  const navigate = useNavigate();


  console.log('Applicant data in list item:', applicant); // Log the individual applicant data


  const handleViewDetailsClick = () => {
    navigate(`/applicant_profile/${applicant.user_id}`);
  };


  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div className="d-flex">
      <img
        src={applicant.profile_picture_url}
        alt={`${applicant.full_name} profile`}
        className="rounded-circle me-3"
        width="50"
        height="50"
      />
        <div>
          <h5>{applicant.full_name}</h5>
          <p>{applicant.job_title || 'Job title not available'}</p> {/* Correct field access */}
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleViewDetailsClick}>
        View Details
      </button>
    </li>
  );
}


export default ApplicantListItem;



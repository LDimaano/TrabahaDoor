import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

function ApplicantJoblist({ currentListings }) {
  const navigate = useNavigate();

  const handleSeeJs = (userId) => {
    navigate(`/useremp_profile/${userId}`);
  };

  return (
    <div className="row">
      {currentListings.map((listing) => {
        // Debugging: log the entire listing object to check its structure
        console.log("Listing data:", listing);

        return (
          <div className="col-md-4 mb-4" key={listing.id || listing.id}>
            <div className="card border-light shadow-sm">
              <div className="card-body text-center">
                <img
                  src={listing.profile_picture_url}
                  alt="profile"
                  className="rounded-circle mb-2"
                  style={{ width: '80px', height: '80px' }}
                />
                <h5 className="card-title">{listing.company_name}</h5>
                <p className="card-text">{listing.contact_person}</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleSeeJs(listing.user_id)}
                >
                  <FontAwesomeIcon icon={faEye} className="me-1" />
                  View Profile
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ApplicantJoblist;

import React from 'react';
import { useNavigate } from 'react-router-dom';

function ApplicantJoblist({ currentListings }) {
  const navigate = useNavigate();

  
  const handleSeeJs = (userId) => {
    navigate(`/userjs_profile/${userId}`);
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Applicants</th>
            <th>View Profile</th> 
          </tr>
        </thead>
        <tbody>
          {currentListings.map((listing) => {
            // Debugging: log the entire listing object to check its structure
            console.log("Listing data:", listing);

            return (
              <tr key={listing.jsid}>
                <td>
                <img
                  src={listing.profile_picture_url}
                  alt="profile"
                  className="me-2"
                  style={{ width: '50px', borderRadius: '50%' }}
                />
                {listing.full_name}
              </td>
                <td>
                <button 
                    className="btn btn-primary" 
                    onClick={() => handleSeeJs(listing.user_id)}
                  >
                    See applicant's profile
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ApplicantJoblist;
  
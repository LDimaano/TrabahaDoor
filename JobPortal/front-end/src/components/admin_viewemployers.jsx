import React from 'react';
import { useNavigate } from 'react-router-dom';

function ApplicantJoblist({ currentListings }) {
  const navigate = useNavigate();

  const handleSeeJs = (userId) => {
    navigate(`/useremp_profile/${userId}`);
  };


  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Employer</th>
            <th>Contact Person</th>
            <th>View Profile</th>
          </tr>
        </thead>
        <tbody>
          {currentListings.map((listing) => {
            // Debugging: log the entire listing object to check its structure
            console.log("Listing data:", listing);

            return (
              <tr key={listing.id || listing.id}>
                <td>
                <img
                  src={listing.profile_picture_url}
                  alt={`${listing.company_name}'s avatar`}
                  className="me-2"
                  style={{ width: '50px', borderRadius: '50%' }}
                />
                {listing.company_name}
              </td>
                <td>{listing.contact_person}</td>
                <td>
                <button 
                    className="btn btn-primary" 
                    onClick={() => handleSeeJs(listing.user_id)}
                  >
                    See Employer's Profile
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
  
import React from 'react';
import { useNavigate } from 'react-router-dom';

function ApplicantJoblist({ currentListings }) {
  const navigate = useNavigate();

  const handleSeeApplication = (user_id) => {
    navigate(`/applicant_profile/${user_id}`);
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Hiring Stage</th>
            <th>Applied Date</th>
            <th>Additional Info</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentListings.map((listing) => {
            // Debugging: log the entire listing object to check its structure
            console.log("Listing data:", listing);

            return (
              <tr key={listing.user_id}>
                <td>
                  <img
                    src={listing.profile_picture_url}
                    alt={`${listing.full_name}'s avatar`}
                    className="me-2"
                    style={{ width: '50px', borderRadius: '50%' }}
                  />
                  {listing.full_name}
                </td>
                <td>
                  {/* Add the hiring stage if available */}
                </td>
                <td>{new Date(listing.date_applied).toLocaleDateString()}</td>
                <td>{listing.additional_info}</td>
                <td>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleSeeApplication(listing.user_id)}
                  >
                    See Applicant's profile
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

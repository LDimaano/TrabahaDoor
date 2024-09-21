import React from 'react';
import { useNavigate } from 'react-router-dom';

function ApplicantJoblist({ currentListings }) {
  const navigate = useNavigate();

  const handleSeeUser_id = (userId, userType) => {
    if (userType === 'jobseeker') {
      navigate(`/userjs_profile/${userId}`);
    } else if (userType === 'employer') {
      navigate(`/useremp_profile/${userId}`);
    }
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Users</th>
            <th>Email</th>
            <th>User Type</th>
            <th>View Profile</th>
          </tr>
        </thead>
        <tbody>
          {currentListings.map((listing) => {
            return (
              <tr key={listing.user_id}>
                <td>
                  <img
                    src={listing.profile_picture_url}
                    alt={`${listing.full_name || listing.company_name}'s avatar`}
                    className="me-2"
                    style={{ width: '50px', borderRadius: '50%' }}
                  />
                  {listing.full_name || listing.company_name}
                </td>
                <td>{listing.email}</td>
                <td>{listing.usertype}</td>
                <td>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleSeeUser_id(listing.user_id, listing.usertype)}
                  >
                    See User's Profile
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

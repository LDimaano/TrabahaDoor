import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTh, faList } from '@fortawesome/free-solid-svg-icons';

function ApplicantJoblist({ currentListings }) {
  const [viewMode, setViewMode] = useState('list');
  const navigate = useNavigate();

  const handleSeeUser_id = (userId, userType) => {
    if (userType === 'jobseeker') {
      navigate(`/userjs_profile/${userId}`);
    } else if (userType === 'employer') {
      navigate(`/useremp_profile/${userId}`);
    }
  };

  // Function to toggle view mode
  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === 'list' ? 'grid' : 'list'));
  };

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-outline-secondary" onClick={toggleViewMode}>
          <FontAwesomeIcon icon={viewMode === 'list' ? faTh : faList} /> Toggle View
        </button>
      </div>

      {viewMode === 'list' ? (
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
              {currentListings.map((listing) => (
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
                      <FontAwesomeIcon icon={faEye} /> Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="row">
          {currentListings.map((listing) => (
            <div className="col-md-4 mb-4" key={listing.user_id}>
              <div className="card h-100">
                <img
                  src={listing.profile_picture_url}
                  alt={`${listing.full_name || listing.company_name}'s avatar`}
                  className="card-img-top"
                  style={{
                    height: '200px',
                    width: '200px',
                    objectFit: 'cover',
                    borderRadius: '50%', // Makes the image circular
                    margin: 'auto',
                    padding: '10px',
                  }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{listing.full_name || listing.company_name}</h5>
                  <p className="card-text"><strong>Email:</strong> {listing.email}</p>
                  <p className="card-text"><strong>User Type:</strong> {listing.usertype}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleSeeUser_id(listing.user_id, listing.usertype)}
                  >
                    <FontAwesomeIcon icon={faEye} /> Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ApplicantJoblist;

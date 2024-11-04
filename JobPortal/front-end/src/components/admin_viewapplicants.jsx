import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTh, faList } from '@fortawesome/free-solid-svg-icons';

function ApplicantJoblist({ currentListings }) {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('list'); // Default view mode is 'list'

  const handleSeeJs = (userId) => {
    navigate(`/userjs_profile/${userId}`);
  };

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === 'list' ? 'grid' : 'list'));
  };

  return (
    <div>
      {/* View toggle button positioned at the upper right */}
      <div className="d-flex justify-content-end mb-3">
        <button 
          className="btn btn-outline-secondary" 
          onClick={toggleViewMode}
        >
          Toggle View
          <FontAwesomeIcon icon={viewMode === 'list' ? faTh : faList} className="ms-2" />
        </button>
      </div>

      {/* Render listings based on selected view mode */}
      {viewMode === 'grid' ? (
        <div className="row">
          {currentListings.map((listing) => (
            <div className="col-md-4 mb-4" key={listing.jsid}>
              <div className="card border-light shadow-sm">
                <div className="card-body text-center">
                  <img
                    src={listing.profile_picture_url}
                    alt="profile"
                    className="rounded-circle mb-2"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />
                  <h5 className="card-title">{listing.full_name}</h5>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleSeeJs(listing.user_id)}
                  >
                     <FontAwesomeIcon icon={faEye} /> Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Applicants</th>
                <th>View Profile</th> 
              </tr>
            </thead>
            <tbody>
              {currentListings.map((listing) => (
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
                       <FontAwesomeIcon icon={faEye} /> Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ApplicantJoblist;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faList, faThLarge } from '@fortawesome/free-solid-svg-icons';
import '../css/card.css'; // Import CSS for custom styles

function ApplicantJoblist({ currentListings }) {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid'); // Default view mode is 'grid'

  const handleSeeJs = (userId) => {
    navigate(`/userjs_profile/${userId}`);
  };

  return (
    <div>
      {/* View toggle buttons */}
      <div className="d-flex justify-content-start mb-3">
        <button 
          className={`btn btn-outline-primary me-2 ${viewMode === 'list' ? 'active' : ''}`} 
          onClick={() => setViewMode('list')}
        >
          <FontAwesomeIcon icon={faList} className="me-1" />
          List View
        </button>
        <button 
          className={`btn btn-outline-primary ${viewMode === 'grid' ? 'active' : ''}`} 
          onClick={() => setViewMode('grid')}
        >
          <FontAwesomeIcon icon={faThLarge} className="me-1" />
          Grid View
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
                    style={{ width: '80px', height: '80px' }}
                  />
                  <h5 className="card-title">{listing.full_name}</h5>
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
                      See applicant's profile
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

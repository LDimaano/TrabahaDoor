import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faList, faThLarge } from '@fortawesome/free-solid-svg-icons';
import '../css/table.css'; // Import CSS for custom styles

function ApplicantJoblist({ currentListings }) {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid'); // Default view mode is 'grid'

  const handleSeeJs = (userId) => {
    navigate(`/useremp_profile/${userId}`);
  };

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === 'list' ? 'grid' : 'list'));
  };

  return (
    <div>
      {/* View toggle button */}
      <div className="d-flex justify-content-start mb-3">
        <button 
          className="btn btn-outline-secondary"
          onClick={toggleViewMode}
        >
           <FontAwesomeIcon icon={viewMode === 'list' ? faTh : faList} /> Toggle View
          {viewMode === 'list' ? 'Grid View' : 'List View'}
        </button>
      </div>

      {/* Render listings based on selected view mode */}
      {viewMode === 'grid' ? (
        <div className="row">
          {currentListings.map((listing) => (
            <div className="col-md-4 mb-4" key={listing.id}>
              <div className="card border-light shadow-sm">
                <div className="card-body text-center">
                  <img
                    src={listing.profile_picture_url}
                    alt="profile"
                    className="rounded-circle mb-2"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
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
          ))}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Employer</th>
                <th style={{ width: '40%' }}>Contact Person</th>
                <th style={{ width: '30%' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentListings.map((listing) => (
                <tr key={listing.id}>
                  <td>
                    <img
                      src={listing.profile_picture_url}
                      alt="profile"
                      className="me-2 rounded-circle"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                    {listing.company_name}
                  </td>
                  <td>{listing.contact_person}</td>
                  <td>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => handleSeeJs(listing.user_id)}
                    >
                      <FontAwesomeIcon icon={faEye} className="me-1" />
                      View Profile
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

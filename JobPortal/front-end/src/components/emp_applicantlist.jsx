import React from 'react';
import { useNavigate } from 'react-router-dom';

function ApplicantJoblist({ currentListings, onHiringStageChange, hiringStages }) {
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
                  {/* Bootstrap CSS Dropdown */}
                  <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle"
                      type="button"
                      id={`dropdownMenuButton-${listing.user_id}`}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {hiringStages[listing.user_id] || 'Received'}
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby={`dropdownMenuButton-${listing.user_id}`}
                    >
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => onHiringStageChange(listing.user_id, 'Received')}
                        >
                          Received
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => onHiringStageChange(listing.user_id, 'In review')}
                        >
                          In review
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => onHiringStageChange(listing.user_id, 'For interview')}
                        >
                          For interview
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => onHiringStageChange(listing.user_id, 'Filled')}
                        >
                          Filled
                        </button>
                      </li>
                    </ul>
                  </div>
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

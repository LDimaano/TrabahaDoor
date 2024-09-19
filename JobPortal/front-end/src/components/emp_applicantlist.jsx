import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

function ApplicantJoblist({ currentListings, onStageChange, hiringStages }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});

  const handleSeeApplication = (user_id) => {
    // This navigates to a new page
    navigate(`/applicant_profile/${user_id}`);
  };

  const openModal = (listing) => {
    setModalData(listing);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleStageChangeInJoblist = async (userId, newStage) => {
    try {
      const response = await fetch(`http://localhost:5000/api/applicants/applications/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hiringStage: newStage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update hiring stage');
      }

      onStageChange(userId, newStage);
    } catch (error) {
      console.error('Error updating hiring stage:', error.message);
    }
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Hiring Stage</th>
            <th>Applied Date</th>
            <th>Application</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentListings.map((listing) => (
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
                    {['Received', 'In review', 'For interview', 'Filled'].map((stage) => (
                      <li key={stage}>
                        <button
                          className="dropdown-item"
                          onClick={() => handleStageChangeInJoblist(listing.user_id, stage)}
                        >
                          {stage}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </td>
              <td>{new Date(listing.date_applied).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => openModal(listing)}
                >
                  <FontAwesomeIcon icon={faEye} /> View
                </button>
              </td>
              <td>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => handleSeeApplication(listing.user_id)}
                >
                  <FontAwesomeIcon icon={faEye} /> View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal fade show" style={{ display: 'block' }} role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Application Details</h5>
              </div>
              <div className="modal-body">
                <p><strong>Full Name:</strong> {modalData.full_name}</p>
                <p><strong>Job Title:</strong> {modalData.job_title}</p>
                <p><strong>Email:</strong> {modalData.email}</p>
                <p><strong>Phone Number:</strong> {modalData.phone_number}</p>
                <p><strong>Additional Info:</strong> {modalData.additional_info}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicantJoblist;

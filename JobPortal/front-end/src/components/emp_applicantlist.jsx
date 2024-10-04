import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

function ApplicantJoblist({ currentListings, onStageChange, hiringStages }) {
  const navigate = useNavigate();
  const jobId = useParams().jobId;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [localHiringStages, setLocalHiringStages] = useState({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedUser , setSelectedUser ] = useState(null);
  const [newStage, setNewStage] = useState('');
  const [activeTab, setActiveTab] = useState('applicants');
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    setLocalHiringStages(hiringStages);
  }, [hiringStages]);

  const fetchRecommendations = async () => {
    const userId = sessionStorage.getItem('user_id');
    if (userId) {
      try {
        const response = await fetch(`http://localhost:5000/api/applicants/recommend-candidates/${jobId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const recommendations = data.recommendations.recommendations; 
        setRecommendations(recommendations);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    }
  };

  const handleSeeApplication = (userId) => {
    navigate(`/applicant_profile/${userId}`);
  };

  const openModal = (listing) => {
    setModalData(listing);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const openConfirmModal = (userId, stage) => {
    setSelectedUser (userId);
    setNewStage(stage);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedUser (null);
    setNewStage('');
  };

  const confirmStageChange = () => {
    if (selectedUser  && newStage) {
      handleStageChangeInJoblist(selectedUser , newStage);
      closeConfirmModal();
    }
  };

  const handleStageChangeInJoblist = async (userId, newStage) => {
    try {
      const response = await fetch(`http://localhost:5000/api/applicants/applications/${userId}/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hiringStage: newStage }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to update hiring stage');
      }

      onStageChange(userId, newStage);
    } catch (error) {
      console.error('Error updating hiring stage:', error.message);
    }
  };

  const renderApplicantRows = (listings) => {
    return listings.map((listing) => (
      <tr key={listing.user_id}>
        <td>
          <img
            src={listing.profile_picture_url}
            alt={'avatar'}
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
              {localHiringStages[listing.user_id] || 'Received'} 
            </button>
            <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${listing.user_id}`}>
              {['Received', 'In review', 'For interview', 'Filled'].map((stage) => (
                <li key={stage}>
                  <button
                    className="dropdown-item"
                    onClick={() => openConfirmModal(listing.user_id, stage)}
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
    ));
  };

  const filteredCurrentListings = activeTab === 'recommended'
    ? currentListings.filter(listing =>
        recommendations.some(recommendation => recommendation.user_id === listing.user_id)
      )
    : currentListings;

  return (
    <div className="table-responsive">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === 'applicants' ? 'active' : ''}`}
            href="#"
            onClick={() => setActiveTab('applicants')}
          >
            Applicants
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === 'recommended' ? 'active' : ''}`}
            href="#"
            onClick={() => {
              setActiveTab('recommended');
              fetchRecommendations();
            }}
          >
            Recommended Applicants
          </a>
        </li>
      </ul>

      <div className="tab-content">
        <div className={`tab-pane ${activeTab === 'applicants' ? 'active' : ''}`} id="applicants">
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
              {renderApplicantRows(filteredCurrentListings)}
            </tbody>
          </table>
        </div>

        <div className={`tab-pane ${activeTab === 'recommended' ? 'active' : ''}`} id="recommended-applicants">
          <h4>Recommended Applicants</h4>
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
              {renderApplicantRows(recommendations)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Application Details */}
      {isModalOpen && (
        <div className="modal fade show" style={{ display: 'block' }} role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Application Details</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
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

      {/* Confirm Modal for Hiring Stage Change */}
      {isConfirmModalOpen &&
        <div className="modal fade show" style={{ display: 'block' }} role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Hiring Stage Change</h5>
              <button type="button" className="btn-close" onClick={closeConfirmModal}></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to change the hiring stage for this applicant to <strong>{newStage}</strong>?</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeConfirmModal}>Cancel</button>
              <button className="btn btn-primary" onClick={confirmStageChange}>Confirm</button>
            </div>
          </div>
        </div>
      </div>
    }
  </div>
);
}

export default ApplicantJoblist;
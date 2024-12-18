import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const styles = {
  dropdownMenu: {
    zIndex: 1050, 
  },
  tableResponsive: {
    minHeight: '500px', 
    overflowY: 'inherit',  
    overflowX: 'inherit', 
  },
};

function ApplicantJoblist({ currentListings, onStageChange, hiringStages }) {
  const navigate = useNavigate();
  const jobId = useParams().jobId;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
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
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/applicants/recommend-candidates/${jobId}`, {
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

  const [additionalMessage, setAdditionalMessage] = useState('');

const confirmStageChange = () => {
  if (selectedUser && newStage) {
    setLocalHiringStages((prevStages) => ({
      ...prevStages,
      [selectedUser]: newStage,
    }));
    handleStageChangeInJoblist(selectedUser, newStage, additionalMessage);
    closeConfirmModal();
  }
};

const handleStageChangeInJoblist = async (userId, newStage, additionalMessage) => {
  try {
    console.log(`Updating hiring stage for userId: ${userId}, jobId: ${jobId}, newStage: ${newStage}`);
    
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/applicants/applications/${userId}/${jobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hiringStage: newStage, additionalMessage }),
    });
    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error response:', errorData);
      throw new Error(errorData || 'Failed to update hiring stage');
    }

    console.log('Hiring stage updated successfully on the server');
    onStageChange(userId, newStage);
  } catch (error) {
    console.error('Error updating hiring stage:', error.message);
  }
};
  
  async function fetchFilledCount() {
    const userId = sessionStorage.getItem('user_id');  
    
    if (!userId) {
      console.error('User ID not found');
      return;
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/applicants/applications/filledCount/${userId}`);
      const data = await response.json();
  
      if (response.ok) {
        data.filledCount.forEach(job => {
          console.log(`Job ID: ${job.jobId}, Title: ${job.jobTitle}, Positions: ${job.positions}, Filled: ${job.isFilled}`);
        });
      } else {
        console.error('Error fetching filled count:', data.error);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  }
  
  fetchFilledCount();
  
  

  const renderApplicantRows = (listings) => {
    return listings.map((listing, index) => (
      <tr key={listing.user_id}>
      {activeTab === 'recommended' && <td>{index + 1}</td>}
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
            <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${listing.user_id}`}
            style={styles.dropdownMenu}>
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
    <div className="table-responsive" style={styles.tableResponsive}>
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
                <th>View Profile</th>
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
                <th>Rank</th>
                <th>Full Name</th>
                <th>Hiring Stage</th>
                <th>Applied Date</th>
                <th>Application</th>
                <th>View Profile</th>
              </tr>
            </thead>
            <tbody>
              {renderApplicantRows(recommendations)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Application Details Modal */}
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
          {modalData.resume && (
            <div>
              <button 
                className="btn btn-primary" 
                onClick={() => setIsPdfModalOpen(true)}
              >
                View File
              </button>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={closeModal}>Close</button>
        </div>
      </div>
    </div>
  </div>
)}

{isPdfModalOpen && (
  <div className="modal fade show" style={{ display: 'block' }} role="dialog">
    <div className="modal-dialog modal-lg" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Resume PDF</h5>
          <button type="button" className="btn-close" onClick={() => setIsPdfModalOpen(false)}></button>
        </div>
        <div className="modal-body">
          <iframe
            src={modalData.resume}
            title="Resume PDF"
            width="100%"
            height="500px"
            style={{ border: 'none' }}
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setIsPdfModalOpen(false)}>Close</button>
        </div>
      </div>
    </div>
  </div>
)}
      {isConfirmModalOpen && (
  <div className="modal fade show" style={{ display: 'block' }} role="dialog">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Confirm Hiring Stage Change</h5>
          <button type="button" className="btn-close" onClick={closeConfirmModal}></button>
        </div>
        <div className="modal-body">
          <p>
            Are you sure you want to change the hiring stage for this applicant to <strong>{newStage}</strong>?
          </p>
          <div className="form-group">
            <label htmlFor="additionalMessage">Additional Message:</label>
            <textarea
              id="additionalMessage"
              className="form-control"
              rows="3"
              value={additionalMessage}
              onChange={(e) => setAdditionalMessage(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={closeConfirmModal}>Cancel</button>
          <button className="btn btn-primary" onClick={confirmStageChange}>Confirm</button>
        </div>
      </div>
    </div>
  </div>
)}

  </div>
);
}

export default ApplicantJoblist;
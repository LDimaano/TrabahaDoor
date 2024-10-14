import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

function ApplicantJoblist({ currentListings}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});

  const openModal = (listing) => {
    setModalData(listing);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);


  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Hiring Stage</th>
            <th>Applied Date</th>
            <th>Application</th>
          </tr>
        </thead>
        <tbody>
          {currentListings.map((listing) => (
            <tr key={listing.user_id}>
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
                {listing.hiring_stage}
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
    </div>
  );
}

export default ApplicantJoblist;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTh, faList } from '@fortawesome/free-solid-svg-icons';

function ApplicantJoblist({ currentListings }) {
  const [viewMode, setViewMode] = useState('list'); // State to track view mode
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const navigate = useNavigate();

  const openModal = (listing) => {
    setModalData(listing);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // Function to toggle view mode
  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === 'list' ? 'grid' : 'list'));
  };

  const handleJobListing = (jobId) => {
    navigate(`/seejoblisting/${jobId}`);
  };

  const handleSeeApplicants = (jobId) => {
    navigate(`/seeapplicantlist/${jobId}`);
  };

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-outline-secondary me-2" onClick={toggleViewMode}>
          <FontAwesomeIcon icon={viewMode === 'list' ? faTh : faList} /> Toggle View
        </button>
      </div>

      {viewMode === 'list' ? (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Job Title</th>
                <th>Contact Person</th>
                <th>View Applicants</th>
                <th>View Job Listing</th>
              </tr>
            </thead>
            <tbody>
              {currentListings.map((listing) => (
                <tr key={listing.job_id}>
                  <td>
                    <img
                      src={listing.profile_picture_url}
                      alt="profile"
                      className="me-2"
                      style={{ width: '50px', borderRadius: '50%' }}
                    />
                    {listing.company_name}
                  </td>
                  <td>{listing.job_title}</td>
                  <td>{listing.contact_person}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleSeeApplicants(listing.job_id)}
                    >
                       <FontAwesomeIcon icon={faEye} /> View
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleJobListing(listing.job_id)}
                    >
                        <FontAwesomeIcon icon={faEye} /> View
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
            <div className="col-md-4 mb-4" key={listing.job_id}>
              <div className="card h-100">
                <img
                  src={listing.profile_picture_url}
                  alt="profile"
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{listing.company_name}</h5>
                  <p className="card-text"><strong>Job Title:</strong> {listing.job_title}</p>
                  <p className="card-text"><strong>Contact:</strong> {listing.contact_person}</p>
                  <button
                    className="btn btn-outline-primary me-2"
                    onClick={() => handleSeeApplicants(listing.job_id)}
                  >
                     <FontAwesomeIcon icon={faEye} /> View
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleJobListing(listing.job_id)}
                  >
                      <FontAwesomeIcon icon={faEye} /> View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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

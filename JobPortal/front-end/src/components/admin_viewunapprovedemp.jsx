import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTh, faList } from '@fortawesome/free-solid-svg-icons';

function ApplicantJoblist({ currentListings, fetchUsers }) {
  const [viewMode, setViewMode] = useState('list');
  const [showModal, setShowModal] = useState(false);
  const [documentUrl, setDocumentUrl] = useState('');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState('');

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === 'list' ? 'grid' : 'list'));
  };

  const handleShowModal = (url) => {
    setDocumentUrl(url);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDocumentUrl('');
  };

  const handleShowApproveModal = (userId) => {
    setSelectedUserId(userId);
    setShowApproveModal(true);
  };

  const handleCloseApproveModal = () => {
    setShowApproveModal(false);
    setSelectedUserId(null);
  };

  const handleShowRejectModal = (userId) => {
    setSelectedUserId(userId);
    setShowRejectModal(true);
  };

  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setSelectedUserId(null);
    setRejectionReason('');
  };

  const handleApprove = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/approve/${selectedUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        console.log('Employer approved successfully');
        // Remove the approved user from the currentListings
        setCurrentListings((prevListings) =>
          prevListings.filter((listing) => listing.user_id !== selectedUserId)
        );
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      handleCloseApproveModal();
    }
  };
  

  const handleReject = async () => {
    try {
      console.log(`Rejecting user with ID: ${selectedUserId}`);
      console.log(`Reason for rejection: ${rejectionReason}`);
  
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/reject/${selectedUserId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectionReason }),
      });
  
      if (response.ok) {
        console.log('Employer rejected successfully');
        // Remove the rejected user from the currentListings
        setCurrentListings((prevListings) =>
          prevListings.filter((listing) => listing.user_id !== selectedUserId)
        );
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      handleCloseRejectModal();
    }
  };
  
  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <Button variant="outline-secondary" onClick={toggleViewMode}>
          <FontAwesomeIcon icon={viewMode === 'list' ? faTh : faList} /> Toggle View
        </Button>
      </div>

      {viewMode === 'list' ? (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Users</th>
                <th>SEC Certificate</th>
                <th>Business Permit</th>
                <th>BIR Certificate</th>
                <th>POEA License</th>
                <th>Private Recruitment Agency License</th>
                <th>Contract Sub Contractor Certificate</th>
                <th>Approve</th>
                <th>Reject</th>
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
                    {listing.full_name || listing.company_name}
                  </td>
                  <td>
                    <Button variant="link" onClick={() => handleShowModal(listing.sec_certificate)}>
                      <FontAwesomeIcon icon={faEye} /> View Document
                    </Button>
                  </td>
                  <td>
                    <Button variant="link" onClick={() => handleShowModal(listing.business_permit)}>
                      <FontAwesomeIcon icon={faEye} /> View Document
                    </Button>
                  </td>
                  <td>
                    <Button variant="link" onClick={() => handleShowModal(listing.bir_certificate)}>
                      <FontAwesomeIcon icon={faEye} /> View Document
                    </Button>
                  </td>
                  <td>
                    <Button variant="link" onClick={() => handleShowModal(listing.poea_license)}>
                      <FontAwesomeIcon icon={faEye} /> View Document
                    </Button>
                  </td>
                  <td>
                    <Button variant="link" onClick={() => handleShowModal(listing.private_recruitment_agency_license)}>
                      <FontAwesomeIcon icon={faEye} /> View Document
                    </Button>
                  </td>
                  <td>
                    <Button variant="link" onClick={() => handleShowModal(listing.contract_sub_contractor_certificate)}>
                      <FontAwesomeIcon icon={faEye} /> View Document
                    </Button>
                  </td>
                  <td>
                    <Button variant="danger" onClick={() => handleShowApproveModal(listing.user_id)}>
                      Approve Employer
                    </Button>
                  </td>
                  <td>
                    <Button variant="warning" onClick={() => handleShowRejectModal(listing.user_id)}>
                      Reject Employer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="row">
          {/* Render grid view */}
        </div>
      )}

      {/* Document Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Document Viewer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {documentUrl && (
            <iframe
              src={documentUrl}
              title="Document"
              style={{ width: '100%', height: '500px', border: 'none' }}
            ></iframe>
          )}
        </Modal.Body>
      </Modal>

      {/* Approval Modal */}
      <Modal show={showApproveModal} onHide={handleCloseApproveModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Approval</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to approve this employer?</p>
          {error && <p className="text-danger">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseApproveModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleApprove}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Rejection Modal */}
      <Modal show={showRejectModal} onHide={handleCloseRejectModal}>
        <Modal.Header closeButton>
          <Modal.Title>Reject Employer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to reject this employer?</p>
          <textarea
            className="form-control"
            placeholder="Enter the reason for rejection"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows="4"
          ></textarea>
          {error && <p className="text-danger">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRejectModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleReject} disabled={!rejectionReason}>
            Reject Employer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ApplicantJoblist;

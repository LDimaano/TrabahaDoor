import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

function ApplicantJoblist({ currentListings, fetchUsers }) {
  const [showModal, setShowModal] = useState(false);
  const [documentUrl, setDocumentUrl] = useState('');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [error, setError] = useState('');

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
        fetchUsers(); // Refresh the user listings
      } else {
        console.error('Failed to approve employer');
        const errorData = await response.json();
        console.error('Error:', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      handleCloseApproveModal(); // Close the approve modal
    }
  };

  return (
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
            <th>Approved</th>
          </tr>
        </thead>
        <tbody>
          {currentListings.map((listing) => (
            <tr key={listing.user_id}>
              <td>
                <img
                  src={listing.profile_picture_url}
                  alt={`${listing.full_name || listing.company_name}'s avatar`}
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
            </tr>
          ))}
        </tbody>
      </table>

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
    </div>
  );
}

export default ApplicantJoblist;

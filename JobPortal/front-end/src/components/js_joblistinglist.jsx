import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

function ApplicantJoblist({ currentListings }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [listings, setListings] = useState(currentListings);

  useEffect(() => {
    setListings(currentListings);
  }, [currentListings]);

  const handleDeleteClick = (application_id) => {
    setSelectedApplicationId(application_id);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobseekers/deleteApplication?application_id=${selectedApplicationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setListings(listings.filter(listing => listing.application_id !== selectedApplicationId));
      } else {
        console.error('Failed to delete the application');
      }
    } catch (error) {
      console.error('Error:', error);
    }

    setShowModal(false);
  };

  return (
    <>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Hiring Status</th>
              <th>Applied Date</th>
              <th>Job Status</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing.application_id}>
                <td>
                  <img
                    src={listing.profile_picture_url}
                    alt={`${listing.job_title}'s avatar`}
                    className="me-2"
                    style={{ width: '50px', borderRadius: '50%' }}
                  />
                  {listing.job_title}
                </td>
                <td>{listing.company_name}</td>
                <td>{listing.status}</td>
                <td>{new Date(listing.date_applied).toLocaleDateString()}</td>
                <td>{listing.job_status}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteClick(listing.application_id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this application?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ApplicantJoblist;

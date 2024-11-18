import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTh, faList } from '@fortawesome/free-solid-svg-icons';

function ApplicantJoblist() {
  const { user_id } = useParams(); 
  console.log(user_id);
  const [viewMode, setViewMode] = useState('list');
  const [showModal, setShowModal] = useState(false);
  const [documentUrl, setDocumentUrl] = useState('');
  const [documents, setDocuments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Fetch documents from the backend
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/viewdocuments/${user_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch documents');
        }
        const data = await response.json();
        setDocuments(data); // Assuming the API returns a single document object
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [user_id]);

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
        <p>Loading documents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-danger">
        <p>Error: {error}</p>
      </div>
    );
  }

  const documentFields = [
    'SEC Certificate',
    'Business Permit',
    'BIR Certificate',
    'POEA License',
    'Private Recruitment Agency License',
    'Contract Sub Contractor Certificate',
  ];

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
                <th>Document Name</th>
                <th>View Document</th>
              </tr>
            </thead>
            <tbody>
              {documentFields.map((field) => (
                <tr key={field}>
                  <td>{field}</td>
                  <td>
                    {documents[field] ? (
                      <Button variant="link" onClick={() => handleShowModal(documents[field])}>
                        <FontAwesomeIcon icon={faEye} /> View Document
                      </Button>
                    ) : (
                      <span className="text-muted">Not Uploaded</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="row">
          {documentFields.map((field) => (
            <div className="col-md-4 mb-4" key={field}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{field}</h5>
                  {documents[field] ? (
                    <Button variant="link" onClick={() => handleShowModal(documents[field])}>
                      <FontAwesomeIcon icon={faEye} /> View Document
                    </Button>
                  ) : (
                    <span className="text-muted">Not Uploaded</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Document Viewer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {documentUrl ? (
            <iframe
              src={documentUrl}
              title="Document Viewer"
              style={{ width: '100%', height: '500px', border: 'none' }}
            ></iframe>
          ) : (
            <p>No document available.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ApplicantJoblist;

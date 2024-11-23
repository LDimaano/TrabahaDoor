import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import '../css/pagination.css'; 

function ApplicantJoblist({ currentListings, setCurrentListings }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [listingsPerPage] = useState(5); 
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  const [selectedJobId, setSelectedJobId] = useState(null); 
  const [successMessage, setSuccessMessage] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false); 
  const [newStatus, setNewStatus] = useState(''); 

  const handleApplyClick = (jobId) => {
    navigate(`/emp_jobdescription/${jobId}`);
  };

  const handleSeeApplicants = (jobId) => {
    navigate(`/applicantlist/${jobId}`);
  };

  const showDeleteConfirmation = (jobId) => {
    setSelectedJobId(jobId);
    setShowDeleteModal(true);
  };

  const handleConfirmDeleteJob = () => {
    handleDeleteJob();
    setShowDeleteModal(false);
  };

  const handleStatusChange = (jobId, newStatus) => {
    setSelectedJobId(jobId);
    setNewStatus(newStatus); 
    setShowStatusModal(true); 
  };

  const handleConfirmStatusChange = async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobs/${selectedJobId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }), 
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update job status');
        }

        const data = await response.json();
        console.log(`Job ${selectedJobId} status updated to:`, data.status);

        setCurrentListings((prevListings) => 
            prevListings.map((listing) => 
                listing.job_id === selectedJobId 
                    ? { ...listing, status: newStatus } 
                    : listing
            )
        );

        setSuccessMessage('Job status updated successfully!');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
        setShowStatusModal(false); 
    } catch (error) {
        console.error('Error updating job status:', error);
        setShowStatusModal(false); 
    }
};

  const handleDeleteJob = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employers/deljoblistings/${selectedJobId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
      });

      if (response.ok) {
        setCurrentListings((prevListings) => prevListings.filter(listing => listing.job_id !== selectedJobId));
        setSuccessMessage('Job deleted successfully!');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
        console.log(`Job ${selectedJobId} deleted successfully.`);
      } else {
        console.error(`Failed to delete job ${selectedJobId}: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error deleting job ${selectedJobId}:`, error);
    }
  };

  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentPaginatedListings = currentListings.slice(indexOfFirstListing, indexOfLastListing);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalListings = currentListings.length;

  return (
    <div className="table-responsive">
      {successMessage && (
        <div className="alert alert-success text-center" role="alert">
          {successMessage}
        </div>
      )}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Date Created</th>
            <th>View Applicants</th>
            <th>View Joblisting</th>
            <th>Status</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {currentPaginatedListings.map((listing) => (
            <tr key={listing.job_id || listing.jobId}>
              <td>{listing.job_title}</td>
              <td>{new Date(listing.datecreated).toLocaleDateString()}</td>
              <td>
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleSeeApplicants(listing.job_id || listing.jobId)}
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
              </td>
              <td>
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleApplyClick(listing.job_id || listing.jobId)}
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
              </td>
              <td>
                <select
                  className="form-select"
                  value={listing.status}
                  onChange={(e) => handleStatusChange(listing.job_id || listing.jobId, e.target.value)}
                >
                  <option value="Hiring">Hiring</option>
                  <option value="Filled">Archive</option>
                </select>
              </td>
              <td>
                <button 
                  className="btn btn-danger" 
                  onClick={() => showDeleteConfirmation(listing.job_id || listing.jobId)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination 
        listingsPerPage={listingsPerPage} 
        totalListings={totalListings} 
        paginate={paginate} 
        currentPage={currentPage}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div 
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '9999',
          }}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '400px',
              maxWidth: '90%',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h4 className="mb-3">Confirm Job Deletion</h4>
            <p>Are you sure you want to delete this job listing? This action cannot be undone.</p>

            <div className="d-flex justify-content-end mt-4">
              <button 
                className="btn btn-secondary me-2" 
                onClick={() => setShowDeleteModal(false)}
                style={{ padding: '10px 20px' }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleConfirmDeleteJob}
                style={{ padding: '10px 20px' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Status Confirmation Modal */}
      {showStatusModal && (
        <div 
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '9999',
          }}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '400px',
              maxWidth: '90%',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h4 className="mb-3">Confirm Status Change</h4>
            <p>Are you sure you want to change the job status?</p>

            <div className="d-flex justify-content-end mt-4">
              <button 
                className="btn btn-secondary me-2" 
                onClick={() => setShowStatusModal(false)}
                style={{ padding: '10px 20px' }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleConfirmStatusChange}
                style={{ padding: '10px 20px' }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    
  );
}
const Pagination = ({ listingsPerPage, totalListings, paginate, currentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalListings / listingsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination justify-content-center">
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <a onClick={() => paginate(number)} href="javascript:void(0)" className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};


export default ApplicantJoblist;

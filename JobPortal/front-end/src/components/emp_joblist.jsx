import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import '../css/pagination.css'; // Ensure you import the custom CSS

function ApplicantJoblist({ currentListings, setCurrentListings }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [listingsPerPage] = useState(5); // Set the number of listings per page
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Track modal visibility
  const [selectedJobId, setSelectedJobId] = useState(null); // Track which job to delete
  const [successMessage, setSuccessMessage] = useState(''); 

  // Function to navigate to the job description page using jobId
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

  const handleConfirmDeleteJob= () => {
    handleDeleteJob();
    setShowDeleteModal(false);
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      // Send a PATCH request to update the job status in the backend
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include credentials if necessary (e.g., for cookies)
        body: JSON.stringify({ status: newStatus }), // Send the new status in the request body
      });
  
      if (response.ok) {
        // Update the status in the current listings in the frontend
        setCurrentListings((prevListings) =>
          prevListings.map((listing) =>
            listing.job_id === jobId ? { ...listing, status: newStatus } : listing
          )
        );
  
        console.log(`Job ${jobId} status updated to: ${newStatus}`);
      } else {
        console.error(`Failed to update status for job ${jobId}: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error updating status for job ${jobId}:`, error);
    }
  };
  

  // Function to handle job deletion
  const handleDeleteJob = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employers/deljoblistings/${selectedJobId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // If you have cookies/sessions
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

  // Get current listings
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
                  value={listing.status || 'Hiring'}
                  onChange={(e) => handleStatusChange(listing.job_id || listing.jobId, e.target.value)}
                >
                  <option value="Hiring">Hiring</option>
                  <option value="Filled">Filled</option>
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
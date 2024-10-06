import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/pagination.css'; // Ensure you import the custom CSS

function ApplicantJoblist({ currentListings }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [listingsPerPage] = useState(5); // Set the number of listings per page

  // Function to navigate to the job description page using jobId
  const handleApplyClick = (jobId) => {
    navigate(`/emp_jobdescription/${jobId}`);
  };
  const handleSeeApplicants = (jobId) => {
    navigate(`/applicantlist/${jobId}`);
  };

  // Get current listings
  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentPaginatedListings = currentListings.slice(indexOfFirstListing, indexOfLastListing);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalListings = currentListings.length;

  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Date Created</th>
            <th>View Applicants</th>
            <th>View Joblisting</th>
          </tr>
        </thead>
        <tbody>
          {currentPaginatedListings.map((listing) => {
            // Debugging: log the entire listing object to check its structure
            console.log("Listing data:", listing);

            return (
              <tr key={listing.job_id || listing.jobId}>
                <td>{listing.job_title}</td>
                <td>{new Date(listing.datecreated).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleSeeApplicants(listing.job_id || listing.jobId)}
                  >
                    See applicants
                  </button>
                </td>
                <td>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleApplyClick(listing.job_id || listing.jobId)}
                  >
                    See joblisting
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination 
        listingsPerPage={listingsPerPage} 
        totalListings={totalListings} 
        paginate={paginate} 
        currentPage={currentPage}
      />
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
            <a onClick={() => paginate(number)} href="#!" className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ApplicantJoblist;

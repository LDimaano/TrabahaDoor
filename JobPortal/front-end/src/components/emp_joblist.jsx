import React from 'react';
import { useNavigate } from 'react-router-dom';

function ApplicantJoblist({ currentListings }) {
  const navigate = useNavigate();

  // Function to navigate to the job description page using jobId
  const handleApplyClick = (jobId) => {
    navigate(`/emp_jobdescription/${jobId}`);
  };
  const handleSeeApplicants = (jobId) => {
    navigate(`/applicantlist/${jobId}`);
  };

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
          {currentListings.map((listing) => {
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
    </div>
  );
}

export default ApplicantJoblist;
  
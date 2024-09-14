import React from 'react';
import { useNavigate } from 'react-router-dom';

function ApplicantJoblist({ currentListings }) {
  const navigate = useNavigate();

  const handleApplyClick = (jobId) => {
    // Navigate to the job description page with dynamic job ID
    navigate(`/jobdescription/${jobId}`);
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Date Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentListings.map((listing) => (
            <tr>
              <td>{listing.job_title}</td>
              <td>{new Date(listing.datecreated).toLocaleDateString()}</td>

              <td>
                <button className="btn btn-primary" onClick={() => handleApplyClick(listing.job_id)}>
                  See Application
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicantJoblist;

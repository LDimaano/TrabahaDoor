import React from 'react';
import { useNavigate } from 'react-router-dom';

function ApplicantJoblist({ currentListings }) {
  const navigate = useNavigate();

  const handleApply = (jobID) => {
    navigate(`/jobdescription/${jobID}`);
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentListings.map((listing) => (
            <tr key={listing.user_id}>
              <td>
                <img
                  src={listing.profile_picture_url}
                  alt={`${listing.job_title}'s avatar`}
                  className="me-2"
                  style={{ width: '50px', borderRadius: '50%' }}
                />
                {listing.job_title}
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleApply(listing.job_id)}
                >
                  Apply
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ApplicantJoblist;

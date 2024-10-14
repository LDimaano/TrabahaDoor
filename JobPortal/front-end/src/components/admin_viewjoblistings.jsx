import React from 'react';
import { useNavigate } from 'react-router-dom';

function ApplicantJoblist({ currentListings }) {
  const navigate = useNavigate();

  // Function to navigate to the job description page using jobId
  const handleJobListing = (jobId) => {
    navigate(`/seejoblisting/${jobId}`);
  };
  const handleSeeApplicants = (jobId) => {
    navigate(`/seeapplicantlist/${jobId}`);
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Job Title</th>
            <th>Contact Person</th>
            <th>View Applicants</th>
            <th>View Job Listing</th>
          </tr>
        </thead>
        <tbody>
          {currentListings.map((listing) => {
            console.log("Listing data:", listing);

            return (
              <tr key={listing.job_id}>
                <td>
                <img
                  src={listing.profile_picture_url}
                  alt="profile"
                  className="me-2"
                  style={{ width: '50px', borderRadius: '50%' }}
                />
                {listing.company_name}
              </td>
              <td>{listing.job_title}</td>
              <td>{listing.contact_person}</td>
              <td>
                <button 
                    className="btn btn-primary" 
                    onClick={() => handleSeeApplicants(listing.job_id || listing.job_id)}
                  >
                    See Applicants
                  </button>
                </td>
                <td>
                <button 
                    className="btn btn-primary" 
                    onClick={() => handleJobListing(listing.job_id || listing.job_id)}
                  >
                    See Job Listing
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
  
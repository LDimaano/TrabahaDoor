import React from 'react';

function ApplicantJoblist({ currentListings}) {

  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>app_id</th>
            <th>Hiring Status</th>
            <th>Applied Date</th>
          </tr>
        </thead>
        <tbody>
          {currentListings.map((listing) => (
            <tr key={listing.app_id}>
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
                {listing.app_id}
              </td>
              <td>
                {listing.status}
              </td>
              <td>{new Date(listing.date_applied).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ApplicantJoblist;

import React from 'react';

function ApplicantJoblist({ currentListings }) {

  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Users</th>
            <th>Email</th>
            <th>User Type</th>
          </tr>
        </thead>
        <tbody>
          {currentListings.map((listing) => {
            return (
              <tr key={listing.user_id}>
                <td>
                  <img
                    src={listing.profile_picture_url}
                    alt={`${listing.full_name || listing.company_name}'s avatar`}
                    className="me-2"
                    style={{ width: '50px', borderRadius: '50%' }}
                  />
                  {listing.full_name || listing.company_name}
                </td>
                <td>{listing.email}</td>
                <td>{listing.usertype}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ApplicantJoblist;

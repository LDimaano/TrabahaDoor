import React from 'react';

const ApplicantDetails = () => (
  <section className="bg-light p-4 mb-4">
    <header className="d-flex align-items-center mb-3">
      <img src="applicant-icon-url" alt="Applicant icon" className="me-2" style={{ width: '24px' }} />
      <h2 className="mb-0">Applicant Details</h2>
    </header>
    <button className="btn btn-outline-secondary d-flex align-items-center">
      <img src="more-action-icon-url" alt="More Action" className="me-2" style={{ width: '24px' }} />
      <span>More Action</span>
    </button>
  </section>
);

export default ApplicantDetails;

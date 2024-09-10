import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const TopNav = () => (
  <header className="d-flex justify-content-between align-items-center bg-white border-bottom p-3">
    <div className="d-flex align-items-center">
      <img src="/assets/profile_company.png" alt="Company logo" className="me-2" style={{ width: '50px' }} />
      <div>
        <span className="d-block text-muted">Company</span>
        <h2 className="d-flex align-items-center mb-0">
          Saint Anthony Montessori
        </h2>
      </div>
    </div>
    <div>
      <i className="fas fa-bell" style={{ fontSize: '24px' }}></i>
      <button className="btn btn-primary d-flex align-items-center">
        <i className="fas fa-plus me-2" style={{ fontSize: '24px' }}></i>
        <span>Post a job</span>
      </button>
    </div>
  </header>
);

export default TopNav;

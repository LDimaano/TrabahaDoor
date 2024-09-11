import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const TopNav = () => (
  <header className="d-flex justify-content-between align-items-center bg-white border-bottom p-3">
    <div className="d-flex align-items-center">
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/0ba9e195b18ac61f1b4efa4e6d4992f6e07b13919e54734c3ab56b46266c06e2?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" alt="Company logo" className="me-2" style={{ width: '50px' }} />
      <div>
        <span className="d-block text-muted">Company</span>
        <h2 className="d-flex align-items-center mb-0">
          Saint Anthony Montessori
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/11e2517998516c181ac04025690221ae22f5c4e4eb4dee7f65d6fdbaf2f88a9b?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" alt="Verified" className="ms-2" style={{ width: '20px' }} />
        </h2>
      </div>
    </div>
    <div>
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/e21b78a18fc145e5107085949b30d159d0cb4a75b08a8bd45b390168709672cb?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" alt="Notifications" className="me-2" style={{ width: '24px' }} />
      <button className="btn btn-primary d-flex align-items-center">
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/8ace288be83ff5c7c4ccfb980d8ab4f5d004c20e952ea0efbd4fec5363689c97?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" alt="Post a job" className="me-2" style={{ width: '24px' }} />
        <span>Post a job</span>
      </button>
    </div>
  </header>
);


export default TopNav;

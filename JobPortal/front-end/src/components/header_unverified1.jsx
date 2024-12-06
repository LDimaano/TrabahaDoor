import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Header() {
  return (
    <nav className="navbar navbar-expand-lg bg-transparent">
      <div className="container d-flex justify-content-between align-items-center">
        <img
          src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`}
          alt="TrabahaDoor Logo"
          width="40" // Increased size for logo
          height="40" // Increased size for logo
          className="me-3"
        />
        <span
          className="fw-bold"
          style={{ fontSize: '1.8rem', letterSpacing: '1px' }} // Bigger font and slight letter spacing
        >
          TrabahaDoor
        </span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
        </div>
      </div>
    </nav>
  );
}

export default Header;

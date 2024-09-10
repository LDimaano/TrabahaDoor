// src/components/Header.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handlePostJobClick = () => {
    navigate('/jobposting');
  };

  return (
    <header className="d-flex justify-content-between align-items-center mb-4">
      <div className="d-flex align-items-center">
        <img src={`${process.env.PUBLIC_URL}/assets/profile_company.png`} alt="Company Logo" className="me-3" style={{ width: '50px' }} />
        <div>
          <span className="text-muted">Company</span>
          <h2>Saint Anthony Montessori</h2>
        </div>
      </div>
      <div>
        <FontAwesomeIcon icon={faBell} className="me-3" />
        <button className="btn btn-primary" onClick={handlePostJobClick}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Post a job
        </button>
      </div>
    </header>
  );
};

export default Header;

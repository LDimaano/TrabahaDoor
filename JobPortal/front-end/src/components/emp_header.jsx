import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [company_name, setCompanyName] = useState(''); // State to store the company name

  const handlePostJobClick = () => {
    navigate('/jobposting');
  };

  useEffect(() => {
    const fetchCompanyName = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/employers/user-infoemp', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('API response data:', data); // Log the API response
          setCompanyName(data.company_name || ''); // Set the company name or default to empty string
        } else {
          console.error('Failed to fetch company name:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching company name:', error);
      }
    };

    fetchCompanyName();
  }, []);

  return (
    <header className="d-flex justify-content-between align-items-center mb-4">
      <div className="d-flex align-items-center">
        <img
          src={`${process.env.PUBLIC_URL}/assets/profile_company.png`}
          alt="Company Logo"
          className="me-3"
          style={{ width: '50px' }}
        />
        <div>
          <span className="text-muted">Company</span>
          <h2>Saint Anthony Montessori</h2>
        </div>
      </div>
      <div className="d-flex align-items-center">
        <div className="navbar-text me-3">
          Welcome, {company_name || 'Guest'} {/* Display the company name or 'Guest' */}
        </div>
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

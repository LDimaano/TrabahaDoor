import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Header() {
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFullName = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user-info', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('API response data:', data); // Log the API response
          setFullName(data.fullName || ''); // Ensure that fullName is set or default to empty string
        } else {
          console.error('Failed to fetch full name:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching full name:', error);
      }
    };

    fetchFullName();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-transparent">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img
            src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`}
            alt="TrabahaDoor Logo"
            width="30"
            height="30"
            className="me-2"
          />
          <span className="fw-bold">TrabahaDoor</span>
        </a>
        <div className="navbar-text">
          Welcome, {fullName || 'Guest'} {/* Display the full name or 'Guest' */}
        </div>
      </div>
    </nav>
  );
}

export default Header;

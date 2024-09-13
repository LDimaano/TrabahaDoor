import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome
import 'bootstrap/dist/css/bootstrap.min.css';

function Header() {
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // To get the current path

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

  const getNavLinkClass = (path) => {
    return location.pathname === path ? 'nav-link active text-center' : 'nav-link text-center';
  };

  return (
    <nav className="navbar navbar-expand-lg bg-transparent">
      <div className="container d-flex justify-content-between align-items-center">
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
        <div className="mx-auto text-center"> {/* Center the welcome text */}
          <span className="navbar-text">
            Welcome, {fullName || 'Guest'}
          </span>
        </div>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/jobs" className={getNavLinkClass('/jobs')}>
                <i className="fas fa-briefcase fa-sm" style={{ color: '#333' }}></i> {/* Job Icon */}
                <br />
                Jobs
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/notifications" className={getNavLinkClass('/notifications')}>
                <i className="fas fa-bell fa-sm" style={{ color: '#333' }}></i> {/* Notifications Icon */}
                <br />
                Notifications
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/profile" className={getNavLinkClass('/profile')}>
                <i className="fas fa-user fa-sm" style={{ color: '#333' }}></i> {/* Profile Icon */}
                <br />
                Profile
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
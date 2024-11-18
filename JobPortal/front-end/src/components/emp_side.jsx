import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faClipboardList, faSignOutAlt, faHourglassStart, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Track the current path
  const [company_name, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [profile_picture_url, setProfilePictureUrl] = useState('');
  const [activeLink, setActiveLink] = useState(location.pathname); // Sync with current route

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const userId = sessionStorage.getItem('user_id');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employers/user-infoemp/${userId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCompanyName(data.company_name || '');
          setEmail(data.email || '');
          setProfilePictureUrl(data.profile_picture_url || '');
        } else {
          console.error('Failed to fetch company information:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching company information:', error);
      }
    };

    fetchCompanyInfo();
  }, []);

  useEffect(() => {
    setActiveLink(location.pathname); // Update active link on route change
  }, [location.pathname]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        window.sessionStorage.clear();
        navigate('/'); 
      } else {
        console.error('Failed to log out:', response.statusText);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <aside className="p-3 d-flex flex-column" style={{ backgroundColor: '#044474', width: '250px', height: '100vh', position: 'relative' }}>
      <div className="d-flex align-items-center justify-content-center mb-4">
        <img
          src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`}
          alt="TrabahaDoor Logo"
          className="img-fluid"
          style={{ width: '30px', marginRight: '10px' }}
        />
        <h4 className="mb-0 text-white" style={{ fontSize: '18px' }}>TrabahaDoor</h4>
      </div>
      <nav className="flex-grow-1">
        <ul className="nav flex-column">
          <li className={`nav-item ${activeLink === '/home_employer' ? 'active' : ''} hover-effect`}>
            <button
              onClick={() => handleNavigation('/home_employer')}
              className="btn btn-link nav-link text-white"
            >
              <FontAwesomeIcon icon={faHome} className="me-2" />
              Home
            </button>
          </li>
          <li className={`nav-item ${activeLink === '/empdashboard' ? 'active' : ''} hover-effect`}>
            <button
              onClick={() => handleNavigation('/empdashboard')}
              className="btn btn-link nav-link text-white"
            >
              <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
              Dashboard
            </button>
          </li>
          <li className={`nav-item ${activeLink === '/applicant_joblisting' ? 'active' : ''} hover-effect`}>
            <button
              onClick={() => handleNavigation('/applicant_joblisting')}
              className="btn btn-link nav-link text-white"
            >
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              Job Listing
            </button>
          </li>
          <li className={`nav-item ${activeLink === '/emp_timetofill' ? 'active' : ''} hover-effect`}>
            <button
              onClick={() => handleNavigation('/emp_timetofill')}
              className="btn btn-link nav-link text-white"
            >
              <FontAwesomeIcon icon={faHourglassStart} className="me-2" />
              Time to fill
            </button>
          </li>
        </ul>
      </nav>
      <div className="mt-4 text-center text-white" style={{ position: 'absolute', bottom: '80px', left: '0', right: '0' }}>
        <img
          src={profile_picture_url}
          alt="User Avatar"
          className="img-fluid rounded-circle"
          style={{ width: '50px', borderRadius: '50%' }}
        />
        <div className="mt-2">
          <p className="mb-0">{company_name}</p>
          <small>{email}</small>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="btn btn-danger mt-auto"
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '0',
          right: '0',
          backgroundColor: 'transparent',
          border: 'none',
          color: 'white',
        }}
      >
        <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
        Logout
      </button>

      {/* Hover effect styling */}
      <style>
        {`
          .nav-item {
            transition: background-color 0.3s ease;
          }
          .nav-item.hover-effect:hover {
            background-color: #02538D;
            cursor: pointer;
          }
          .nav-item.active {
            background-color: #022E52;
          }
        `}
      </style>
    </aside>
  );
};

export default Sidebar;

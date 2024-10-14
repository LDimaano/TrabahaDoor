import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faClipboardList, faSignOutAlt, faHourglassStart } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const navigate = useNavigate();
  const [company_name, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [profile_picture_url, setProfilePictureUrl] = useState('');

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
          console.log('API response data:', data);
          
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
        // Clear session data
        window.sessionStorage.clear();
        // Redirect to login page or home page
        navigate('/'); // Adjust as needed
      } else {
        console.error('Failed to log out:', response.statusText);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleHomeClick = () => {
    navigate('/home_employer');
  };

  const handleJobListingClick = () => {
    navigate('/applicant_joblisting');
  };

  const handleTimeToFillClick = () => {
    navigate('/emp_timetofill');
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
          <li className="nav-item">
            <button onClick={handleHomeClick} className="btn btn-link nav-link text-white">
              <FontAwesomeIcon icon={faHome} className="me-2" />
              Home
            </button>
          </li>
          <li className="nav-item">
            <button onClick={handleJobListingClick} className="btn btn-link nav-link text-white">
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              Job Listing
            </button>
          </li>
          <li className="nav-item">
            <button onClick={handleTimeToFillClick} className="btn btn-link nav-link text-white">
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
    </aside>
  );
};

export default Sidebar;

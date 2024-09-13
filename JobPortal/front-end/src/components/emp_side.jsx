import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faUserFriends, faClipboardList } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const [company_name, setCompanyName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user-infoemp', {
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
        } else {
          console.error('Failed to fetch company information:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching company information:', error);
      }
    };

    fetchCompanyInfo();
  }, []);

  return (
    <aside className="p-3 d-flex flex-column" style={{ backgroundColor: '#044474', width: '250px', height: '100vh', position: 'relative' }}>
      <div className="d-flex align-items-center justify-content-center mb-4">
        <img
          src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`}
          alt="TrabahaDoor Logo"
          className="img-fluid"
          style={{ width: '30px', marginRight: '10px' }} // Add margin to the right of the logo
        />
        <h4 className="mb-0 text-white" style={{ fontSize: '18px' }}>TrabahaDoor</h4> {/* Text color set to white */}
      </div>
      <nav className="flex-grow-1">
        <ul className="nav flex-column">
          <li className="nav-item">
            <a href="#profile" className="nav-link text-white">
              <FontAwesomeIcon icon={faBuilding} className="me-2" />
              Profile
            </a>
          </li>
          <li className="nav-item active">
            <a href="#applicants" className="nav-link text-white">
              <FontAwesomeIcon icon={faUserFriends} className="me-2" />
              All Applicants
            </a>
          </li>
          <li className="nav-item">
            <a href="#jobs" className="nav-link text-white">
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              Job Listing
            </a>
          </li>
        </ul>
      </nav>
      <div className="mt-4 text-center text-white" style={{ position: 'absolute', bottom: '20px', left: '0', right: '0' }}>
        <img
          src={`${process.env.PUBLIC_URL}/assets/profile.png`}
          alt="User Avatar"
          className="img-fluid rounded-circle"
          style={{ width: '50px', borderRadius: '50%' }}
        />
        <div className="mt-2">
          <p className="mb-0">{company_name}</p>
          <small>{email}</small>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
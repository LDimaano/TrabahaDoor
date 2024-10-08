import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUsers, faBriefcase, faSignOutAlt, faUser, faBuilding, faArchive } from '@fortawesome/free-solid-svg-icons';

const SideBar = () => {
  const [email, setEmail] = useState('');
  const menuItems = [
    { icon: faTachometerAlt, caption: "Dashboard", link: "/admindashboard" },
    { icon: faBuilding, caption: "All Employers", link: "/admin_employers" },
    { icon: faUsers, caption: "All Applicants", link: "/admin_applicants", active: true },
    { icon: faBriefcase, caption: "Job Listing", link: "/admin_joblistings" },
    { icon: faUser, caption: "All Users", link: "/admin_users" },
    { icon: faArchive, caption: "Archived Users", link: "/admin_archived_users" }

  ];

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        window.sessionStorage.clear();
        window.location.href = '/';
      } else {
        console.error('Failed to log out:', response.statusText);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/infoadmin', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
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
    <aside 
      className="p-3 d-flex flex-column"
      style={{
        backgroundColor: '#044474',
        width: '250px',
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
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
          {menuItems.map((item, index) => (
            <li key={index} className={`nav-item ${item.active ? 'active' : ''}`}>
              <a href={item.link} className="nav-link text-white">
                <FontAwesomeIcon icon={item.icon} className="me-2" />
                {item.caption}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-4 text-center text-white" style={{ position: 'absolute', bottom: '80px', left: '0', right: '0' }}>
        <img
          src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`}
          alt="User Avatar"
          className="img-fluid"
          style={{ width: '50px', borderRadius: '0%' }} 
        />
        <div className="mt-2">
          <p className="mb-0">TrabahaDoor</p>
          <small>{email}</small>
        </div>
      </div>
      <button 
        onClick={handleLogout} 
        className="btn btn-light mt-auto" 
        style={{ 
          position: 'absolute', 
          bottom: '20px', 
          left: '0', 
          right: '0', 
          backgroundColor: 'transparent', 
          border: 'none', 
          color: '#ffffff' 
        }}
      >
        <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
        Logout
      </button>
    </aside>
  );
};

export default SideBar;

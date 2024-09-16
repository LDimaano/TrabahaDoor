import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUsers, faBriefcase, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons'; // Import the faUser icon

const SideBar = () => {
  const menuItems = [
    { icon: faTachometerAlt, caption: "Dashboard" },
    { icon: faUsers, caption: "All Applicants", active: true },
    { icon: faBriefcase, caption: "Job Listing" },
    { icon: faUser, caption: "All Users" }, // Added All Users menu item
  ];

  const handleLogout = () => {
    // Logic for logout
  };

  return (
    <aside className="p-3 d-flex flex-column" style={{ 
      backgroundColor: '#044474', 
      width: '250px', 
      height: '100vh', 
      position: 'fixed'  // Ensure sidebar stays fixed
    }}>
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
              <a href={`/${item.caption.replace(/\s+/g, '').toLowerCase()}`} className="nav-link text-white">
                <FontAwesomeIcon icon={item.icon} className="me-2" />
                {item.caption}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-4 text-center text-white" style={{ position: 'absolute', bottom: '80px', left: '0', right: '0' }}>
        <img
          src={`${process.env.PUBLIC_URL}/assets/profile.png`}
          alt="User Avatar"
          className="img-fluid rounded-circle"
          style={{ width: '50px', borderRadius: '50%' }}
        />
        <div className="mt-2">
          <p className="mb-0">TrabahaDoor</p>
          <small>trabahadoor@gmail.com</small>
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

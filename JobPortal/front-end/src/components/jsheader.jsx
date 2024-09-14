import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome
import 'bootstrap/dist/css/bootstrap.min.css';

function Header() {
  const [fullName, setFullName] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const location = useLocation(); // To get the current path

  useEffect(() => {
    const fetchFullName = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/jobseekers/user-info', {
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

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/notifications', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications || []);
        } else {
          console.error('Failed to fetch notifications:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const getNavLinkClass = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleProfileClick = () => {
    navigate('/js_myprofile'); // Use absolute path
  };

  const handleViewAllClick = () => {
    navigate('/js_notifications'); // Navigate to notifications page
  };

  const activeBarStyle = {
    position: 'absolute',
    bottom: '-5px',
    left: '0',
    right: '0',
    height: '2px',
    backgroundColor: '#007bff', // Active bar color
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
          <ul className="navbar-nav ms-auto d-flex align-items-center">
            <li className="nav-item mx-3 position-relative">
              <Link to="/jobs" className={getNavLinkClass('/jobs')}>
                <i className="fas fa-briefcase fa-lg" style={{ color: '#6c757d' }}></i>
              </Link>
              {location.pathname === '/jobs' && (
                <div style={activeBarStyle} />
              )}
            </li>
            <li className="nav-item mx-3 position-relative">
              <button
                className="btn btn-link"
                onClick={toggleNotifications}
                aria-expanded={showNotifications}
              >
                <i className="fas fa-bell fa-lg" style={{ color: '#6c757d' }}></i>
              </button>
              {showNotifications && (
                <div className="position-absolute bg-white border rounded shadow p-2" style={{ top: '100%', right: '0', width: '250px' }}>
                  <div className="notifications-list">
                    {notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <p key={index}>{notification.message}</p>
                      ))
                    ) : (
                      <p>No new notifications</p>
                    )}
                    <button
                      className="btn btn-link mt-2"
                      onClick={handleViewAllClick}
                    >
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
              {location.pathname === '/notifications' && (
                <div style={activeBarStyle} />
              )}
            </li>
            <li className="nav-item mx-3 position-relative">
              <button
                className="btn btn-link"
                onClick={handleProfileClick} // Handle profile click
              >
                <i className="fas fa-user fa-lg" style={{ color: '#6c757d' }}></i>
              </button>
              {location.pathname === '/js_myprofile' && (
                <div style={activeBarStyle} />
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;

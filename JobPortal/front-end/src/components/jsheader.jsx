import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Header() {
  const [fullName, setFullName] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = sessionStorage.getItem('user_id');
  console.log('User ID from sessionStorage:', userId);

  // Fetch user full name
  useEffect(() => {
    const userId = sessionStorage.getItem('user_id');
    const fetchFullName = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobseekers/user-info/${userId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFullName(data.fullName || '');
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
    const socket = io(process.env.REACT_APP_SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });
    
    socket.on('connect_error', (err) => {
      console.error('Connection Error:', err);
    });
    
    socket.on('connect', () => {
      console.log('Successfully connected to the socket server');
    });

    if (userId) {
      socket.emit('joinRoom', userId);
      fetchNotifications();
    }

    socket.on('newNotification', (notification) => {
      setNotifications((prev) => [...prev, notification]);
      setNotificationCount((prevCount) => prevCount + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const fetchNotifications = async () => {
    const userId = sessionStorage.getItem('user_id');
     
    // Check if userId exists before making the fetch request
     if (!userId) {
      console.error('User ID not found in session storage');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jsnotifications/${userId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched notifications:', data.notifications);
        setNotifications(data.notifications);
        setNotificationCount(data.notifications.filter((notif) => notif.notif_status === 'new').length);
      } else {
        console.error('Failed to fetch notifications:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const markNotificationsAsViewed = async () => {
    const userId = sessionStorage.getItem('user_id');
    const newApplicationIds = notifications.filter((n) => n.notif_status === 'new').map((n) => n.application_id);
    const newContactIds = notifications
    .filter((n) => n.notif_status === 'new' && n.contact_id)
    .map((n) => n.contact_id);
    if (newApplicationIds.length > 0 || newContactIds.length > 0) {
      try {

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jsnotifications/mark-as-viewed/${userId}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ applicationIds: newApplicationIds, contactIds: newContactIds }),
        });

        if (response.ok) {
          await fetchNotifications(); // Re-fetch notifications after marking them as viewed
          setNotificationCount(0); // Reset the count after marking as viewed
        } else {
          const errorData = await response.json();
          console.error('Failed to mark notifications as viewed:', response.statusText, errorData);
        }
      } catch (error) {
        console.error('Error marking notifications as viewed:', error);
      }
    }
  };

  const getNavLinkClass = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  const handleProfileClick = () => {
    navigate('/js_myprofile');
  };

  const handleViewAllClick = () => {
    navigate('/js_notifications');
  };

  const handleHomeClick = () => {
    navigate('/home_employer');
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
        window.location.href = '/';
      } else {
        console.error('Failed to log out:', response.statusText);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-transparent">
      <div className="container d-flex justify-content-between align-items-center">
      <button 
          className="navbar-brand d-flex align-items-center btn btn-link" 
          onClick={handleHomeClick} 
          style={{ textDecoration: 'none' }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`}
            alt="TrabahaDoor Logo"
            width="30"
            height="30"
            className="me-2"
          />
          <span className="fw-bold">TrabahaDoor</span>
        </button>
        <span className="navbar-text mx-auto">
          Welcome, {fullName || 'Guest'}
        </span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto d-flex align-items-center">
            <li className="nav-item mx-3">
              <Link to="/js_joblistings" className={getNavLinkClass('/js_joblistings')}>
                <i className="fas fa-briefcase fa-lg" style={{ color: '#6c757d' }}></i>
              </Link>
            </li>
            <li className="nav-item mx-3">
              <button className="btn btn-link" onClick={toggleNotifications}>
                <i className="fas fa-bell fa-lg" style={{ color: '#6c757d' }}></i>
                {notificationCount > 0 && (
                  <span className="badge bg-danger">{notificationCount}</span>
                )}
              </button>
              {showNotifications && (
                <div
                  className="position-absolute bg-white border rounded shadow p-2"
                  style={{ top: '100%', right: '0', width: '250px', zIndex: 1050 }}
                  onMouseLeave={() => {
                    markNotificationsAsViewed();
                    setShowNotifications(false);
                  }}
                >
                  <h6 className="mb-2 text-center">Notifications</h6>
                  {notifications.length > 0 ? (
                    notifications.slice(0, 7).map((notification, index) => (
                      <div key={index} className="d-flex justify-content-between">
                        <p>{notification.message}</p>
                      </div>
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
              )}
            </li>
            <li className="nav-item mx-3">
              <button className="btn btn-link" onClick={handleProfileClick}>
                <i className="fas fa-user fa-lg" style={{ color: '#6c757d' }}></i>
              </button>
            </li>
            <li className="nav-item mx-3">
              <button className="btn btn-link" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt fa-lg" style={{ color: '#6c757d' }}></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Header() {
  const [companyInfo, setCompanyInfo] = useState({ companyName: '', contactPerson: '' });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = sessionStorage.getItem('user_id');

  useEffect(() => {
    const userId = sessionStorage.getItem('user_id');
    const fetchCompanyInfo = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employers/user-infoemp/${userId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCompanyInfo({
            companyName: data.company_name || '',
            contactPerson: data.contact_person || '',
          });
        } else {
          console.error('Failed to fetch company info:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching company info:', error);
      }
    };
    fetchCompanyInfo();
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notifications/${userId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const newNotifications = data.notifications.filter((notif) => notif.status === 'new');
        setNotifications(data.notifications);
        setNotificationCount(newNotifications.length);
      } else {
        console.error('Failed to fetch notifications:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const toggleNotifications = async () => {
    setShowNotifications((prev) => !prev);

    if (!showNotifications) {
      const newJobIds = notifications.filter((n) => n.status === 'new').map((n) => n.job_id);

      if (newJobIds.length > 0) {
        try {
          const userId = sessionStorage.getItem('user_id');
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notifications/mark-as-viewed/${userId}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ jobIds: newJobIds }),
          });

          if (response.ok) {
            await fetchNotifications();
            setNotificationCount(0);
          } else {
            console.error('Failed to mark notifications as viewed:', response.statusText);
          }
        } catch (error) {
          console.error('Error marking notifications as viewed:', error);
        }
      }
    }
  };

  const getNavLinkClass = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  const handleProfileClick = () => {
    navigate('/emp_myprofile');
  };

  const handleViewAllClick = () => {
    navigate('/emp_notifications');
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
          Welcome, {companyInfo.companyName || 'Guest'}
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
              <Link to="/applicant_joblisting" className={getNavLinkClass('/js_joblistings')}>
                <i className="fas fa-briefcase fa-lg" style={{ color: '#6c757d' }}></i>
              </Link>
            </li>
            <li className="nav-item mx-3">
  <div className="position-relative">
    <button
      className="btn btn-link"
      onClick={toggleNotifications}
      aria-expanded={showNotifications}
    >
      <i className="fas fa-bell fa-lg" style={{ color: '#6c757d' }}></i>
      {notificationCount > 0 && (
        <span 
          className="badge bg-danger position-absolute"
          style={{ top: '0', right: '5px' }} // Adjust top and right as needed
        >
          {notificationCount}
        </span>
      )}
    </button>
    {showNotifications && (
      <div
        className="position-absolute bg-white border rounded shadow p-2"
        style={{ top: '100%', right: '0', width: '250px', zIndex: 1050 }}
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
        <button className="btn btn-link mt-2" onClick={handleViewAllClick}>
          View All Notifications
        </button>
      </div>
    )}
  </div>
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

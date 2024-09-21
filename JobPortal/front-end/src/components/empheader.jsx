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
  const [viewedNotifications, setViewedNotifications] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = sessionStorage.getItem('user_id');

  // Fetch user full name
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/employers/user-infoemp', {
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
    const socket = io('http://localhost:5000', { withCredentials: true });

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
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/notifications`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const newNotifications = data.notifications.filter(
          (notif) => !viewedNotifications.includes(notif.job_id)
        );
        setNotifications(newNotifications);
        setNotificationCount(newNotifications.length);
      } else {
        console.error('Failed to fetch notifications:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const getNavLinkClass = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      fetchNotifications();
      setNotificationCount(0); // Reset notification count when opening
    }
  };

  const handleNotificationClick = async (job_id) => {
    // Mark the notification as viewed and update server
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${job_id}/read`, {
        method: 'PUT',  // Change to PUT
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        setViewedNotifications((prev) => [...prev, job_id]);
        setNotifications((prev) => prev.filter((n) => n.job_id !== job_id));
        setNotificationCount((prevCount) => prevCount - 1); // Decrease count
      } else {
        console.error('Failed to mark notification as read:', response.statusText);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  

  const handleProfileClick = () => {
    navigate('/emp_myprofile');
  };

  const handleViewAllClick = () => {
    navigate('/emp_notifications');
  };

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
        <span className="navbar-text mx-auto">
          Welcome, {companyInfo.companyName || 'Guest'}
        </span>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto d-flex align-items-center">
            <li className="nav-item mx-3 position-relative">
              <Link to="/applicant_joblisting" className={getNavLinkClass('/js_joblistings')}>
                <i className="fas fa-briefcase fa-lg" style={{ color: '#6c757d' }}></i>
              </Link>
            </li>
            <li className="nav-item mx-3 position-relative">
              <button
                className="btn btn-link"
                onClick={toggleNotifications}
                aria-expanded={showNotifications}
              >
                <i className="fas fa-bell fa-lg" style={{ color: '#6c757d' }}></i>
                {notificationCount > 0 && (
                  <span className="badge bg-danger">{notificationCount}</span>
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
                        <button
                          className="btn btn-link"
                          onClick={() => handleNotificationClick(notification.job_id)}
                        >
                          <i className="fas fa-check"></i>
                        </button>
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
            <li className="nav-item mx-3 position-relative">
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

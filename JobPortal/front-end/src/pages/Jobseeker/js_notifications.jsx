import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/jsheader'; // Add the Header component
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate(); // Initialize useNavigate

  // Initialize WebSocket connection
  useEffect(() => {
    const userId = sessionStorage.getItem('user_id');
    const socket = io('http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket'],
    });

    if (userId) {
      socket.emit('joinRoom', userId);
    }

    fetchNotifications();

    socket.on('newNotification', (newNotification) => {
      setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
      setNotificationCount((prevCount) => prevCount + 1);
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Function to fetch notifications from the backend
  const fetchNotifications = async () => {
    const userId = sessionStorage.getItem('user_id');
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/alljsnotifications`, {
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
      setError(`Error fetching notifications: ${error.message}`);
    }
  };

  // Function to handle notification click and navigate based on message content
  const handleNotificationClick = (notification) => {
    const hiringStatusPattern = /Your application for (.+) has been updated to (.+)/;
    const employerContactPattern = /(.+) wants to connect with you/;
  
    if (hiringStatusPattern.test(notification.message)) {
      navigate('/js_joblistings'); // Redirect to job listings page
    } else if (employerContactPattern.test(notification.message)) {
      navigate(`/js_empprofile/${notification.userId}`); // Redirect to employer profile page with user_id
    }
  };
  

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <h1 className="mb-4">Notifications</h1>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {notifications.length > 0 ? (
          <div className="list-group">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)} // Make notification clickable
                className={`list-group-item d-flex justify-content-between align-items-start mb-3 p-3 ${
                  notification.status === 'new' ? 'bg-light border border-primary' : 'bg-white'
                }`}
                style={{ borderRadius: '0.5rem', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', cursor: 'pointer' }} // Added cursor pointer for clickable effect
              >
                <div className="d-flex align-items-center ms-2 me-auto">
                  <img src={notification.profile_picture} alt="Profile" className="rounded-circle me-2" style={{ width: '40px', height: '40px' }} />
                  <div>
                    <div className="fw-bold">{notification.message}</div>
                    <small className="text-muted">
                      {notification.date_applied ? new Date(notification.date_applied).toLocaleString() : 'Unknown date'}
                    </small>
                  </div>
                </div>
                {notification.status === 'new' && (
                  <span className="badge bg-primary rounded-pill">New</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info">No notifications available.</div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

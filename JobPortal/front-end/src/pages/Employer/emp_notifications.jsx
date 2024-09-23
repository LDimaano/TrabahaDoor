import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/empheader';
import { io } from 'socket.io-client';

function EmpNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);

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
      const response = await fetch(`http://localhost:5000/api/allnotifications`, {
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

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <h1 className="mb-4">Notifications</h1>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {notifications.length > 0 ? (
          <div className="list-group">
            {notifications.map((notification, index) => (
              <div
                key={notification.id || index}
                className={`list-group-item d-flex justify-content-between align-items-start mb-3 p-3 ${
                  notification.status === 'new' ? 'bg-light border border-primary' : 'bg-white'
                }`}
                style={{ borderRadius: '0.5rem', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
              >
                <div className="ms-2 me-auto d-flex align-items-center">
                    <img src={notification.profile_picture} alt="Profile" className="rounded-circle me-2" style={{ width: '40px', height: '40px' }} />
                    <div className="fw-bold">
                      {notification.message.split(':').map((part, idx) => (
                        idx === 0 ? <span key={idx}>{part}</span> : <span key={idx} className="fw-bold">{part}</span>
                      ))}
                    </div>
                    <small className="text-muted">
                      {notification.date_applied ? new Date(notification.date_applied).toLocaleString() : 'Unknown date'}
                    </small>
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
}

export default EmpNotifications;

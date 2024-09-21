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
    const userId = sessionStorage.getItem('user_id'); // Fetch userId from sessionStorage
    const socket = io('http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket'],
    });


    if (userId) {
      // Join the user's room for real-time notifications
      socket.emit('joinRoom', userId);
    }


    // Fetch initial notifications when the component mounts
    fetchNotifications();


    // Listen for new notifications in real-time
    socket.on('newNotification', (newNotification) => {
      console.log('Real-time notification received:', newNotification);
      setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
      setNotificationCount((prevCount) => prevCount + 1); // Increment the notification count
    });


    socket.on('connect', () => {
      console.log('Connected to WebSocket:', socket.id);
    });


    socket.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err);
    });


    // Cleanup when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);


  // Function to fetch notifications from the backend
  const fetchNotifications = async () => {
    const userId = sessionStorage.getItem('user_id'); // Fetch userId from sessionStorage
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
                key={notification.id || index} // Use a unique key if available
                className={`list-group-item d-flex flex-column justify-content-start align-items-start mb-3 py-3 ${
                  notification.status === 'new' ? 'bg-light border-primary' : 'bg-white'
                }`}
                style={{ height: 'auto' }}
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">
                    {notification.message.split(':').map((part, idx) => (
                      idx === 0 ? <span key={idx}>{part}</span> : <span key={idx} className="fw-bold">{part}</span>
                    ))}
                  </div>
                </div>
                {notification.status === 'new' && <span className="badge bg-primary rounded-pill">New</span>}
              </div>
            ))}
          </div>
        ) : (
          <p>No notifications available.</p>
        )}
      </div>
    </div>
  );
}


export default EmpNotifications;

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Header from '../../components/empheader'; // Import Header component

function EmpNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  // Fetch userId from sessionStorage using the correct key (user_id)
  useEffect(() => {
    const userId = sessionStorage.getItem('user_id'); // Updated key
    if (userId) {
      fetchNotifications(userId);
    }
  }, []);

  // Function to fetch notifications
  const fetchNotifications = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/employers/notifications/${userId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.statusText}`);
      }

      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      setError(`Error fetching notifications: ${error.message}`);
    }
  };

  return (
    <div>
      <Header /> {/* Render the Header component */}
      <div className="container mt-4">
        <h1 className="mb-4">Notifications</h1>
        {error && <div className="alert alert-danger" role="alert">{error}</div>} {/* Display error message */}
        {notifications.length > 0 ? (
          <div className="list-group">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className={`list-group-item d-flex flex-column justify-content-start align-items-start mb-3 py-3 ${
                  notification.status === 'new' ? 'bg-light border-primary' : 'bg-white'
                }`}
                style={{ height: 'auto' }} // Adjust height if necessary
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

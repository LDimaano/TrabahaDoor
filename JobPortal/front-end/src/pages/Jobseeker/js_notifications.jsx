import React, { useState } from 'react';

const Notifications = () => {
  const [notifications] = useState([
    { id: 1, message: 'New job application received', time: '2 mins ago' },
    { id: 2, message: 'Your profile was viewed by a recruiter', time: '1 hour ago' },
    { id: 3, message: 'New message from employer', time: '3 hours ago' },
    // Add more notifications as needed
  ]);
  const [showAll, setShowAll] = useState(false);

  const handleToggle = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="container mt-4">
      <h3>Notifications</h3>
      <ul className="list-group">
        {notifications.length === 0 ? (
          <li className="list-group-item">No notifications</li>
        ) : (
          notifications.slice(0, showAll ? notifications.length : 5).map((notification) => (
            <li className="list-group-item" key={notification.id}>
              <div className="d-flex justify-content-between align-items-center">
                <span>{notification.message}</span>
                <span className="badge bg-secondary">{notification.time}</span>
              </div>
            </li>
          ))
        )}
      </ul>
      {notifications.length > 5 && (
        <div className="mt-3 text-center">
          <button
            className="btn btn-link"
            onClick={handleToggle}
          >
            {showAll ? 'Show Less' : 'View All Notifications'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;

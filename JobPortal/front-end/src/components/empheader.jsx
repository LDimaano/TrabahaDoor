import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Header() {
    const [companyInfo, setCompanyInfo] = useState({
        companyName: '',
        contactPerson: ''
    });
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    const location = useLocation(); // To get the current path

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
                    console.log('API response data:', data);
                    setCompanyInfo({
                        companyName: data.company_name || '',
                        contactPerson: data.contact_person || ''
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
        const fetchNotifications = async () => {
            try {
                const response = await fetch('http://localhost:5000/employers/api/notifications/${userId}', {
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
        navigate('/applicantlist'); // Use absolute path
    };

    const handleViewAllClick = () => {
        navigate('/emp_notifications'); // Navigate to notifications page
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
          window.location.href = '/'; // Adjust as needed
        } else {
          console.error('Failed to log out:', response.statusText);
        }
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };
    
    const activeBarStyle = {
        position: 'absolute',
        bottom: '-5px',
        left: '0',
        right: '0',
        height: '2px',
        backgroundColor: '#007bff',
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
                <div className="mx-auto text-center">
                    <span className="navbar-text">
                        Welcome, {companyInfo.companyName || 'Company name'} - {companyInfo.contactPerson || 'Guest'}
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
                                onClick={handleProfileClick}
                            >
                                <i className="fas fa-user fa-lg" style={{ color: '#6c757d' }}></i>
                            </button>
                            {location.pathname === '/applicantlist' && (
                                <div style={activeBarStyle} />
                            )}
                        </li>
                        <li className="nav-item mx-3">
                            <button
                                className="btn btn-link"
                                onClick={handleLogout}
                            >
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

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Header() {
    const [companyInfo, setCompanyInfo] = useState({
        companyName: '',
        contactPerson: ''
    });
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);
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

    // Initialize WebSocket connection
    useEffect(() => {
        const socket = io('http://localhost:5000', {
            withCredentials: true,
            transports: ['websocket'], // Use WebSocket transport only
        });

        // Join user's room for notifications
        if (userId) {
            socket.emit('joinRoom', userId);
        }

        socket.on('newNotification', (notification) => {
            if (notification.status === "new") {
                setNotificationCount((prevCount) => prevCount + 1); // Increment count for new notifications
            }
            setNotifications((prev) => [...prev, notification]); // Add notification to the list
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
    }, [userId]);

    // Fetch notifications
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
                setNotifications(data.notifications || []);
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
            fetchNotifications(); // Fetch notifications when opened
            setNotificationCount(0); // Reset count when opening the dropdown
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

    const activeBarStyle = {
        position: 'absolute',
        bottom: '-5px',
        left: '0',
        right: '0',
        height: '2px',
        backgroundColor: '#007bff',
    };

    const notificationDropdownStyle = {
        top: '100px', // Adjust as per your page layout
        right: '20px',
        zIndex: 9999, // Ensures it stays on top of other elements
        width: '300px', // Adjust width as needed
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
                        Welcome, {companyInfo.companyName || 'Guest'}
                    </span>
                </div>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto d-flex align-items-center">
                        <li className="nav-item mx-3 position-relative">
                            <Link to="/applicant_joblisting" className={getNavLinkClass('/applicant_joblisting')}>
                                <i className="fas fa-briefcase fa-lg" style={{ color: '#6c757d' }}></i>
                            </Link>
                            {location.pathname === '/applicantlist' && (
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
                                {notificationCount > 0 && (
                                    <span className="badge" style={{
                                        position: 'absolute',
                                        top: '0',
                                        right: '0',
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        backgroundColor: 'black', // Set background color to black
                                        display: 'inline-block',
                                    }} />
                                )}
                            </button>
                            {showNotifications && (
                                <div
                                    className="position-absolute bg-white border rounded shadow p-2"
                                    style={notificationDropdownStyle}
                                >
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

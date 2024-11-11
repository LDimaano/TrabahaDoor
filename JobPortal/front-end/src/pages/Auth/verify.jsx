import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/header_unverified'; // Import the Header component

function EmailVerification() {
  const [message, setMessage] = useState('Verifying your email...');
  const location = useLocation();
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    console.log('Location search:', location.search); // Debugging output

    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    console.log('Extracted token:', token); // Debugging output

    if (token) {
      // Use fetch to send the token to the backend for verification
      fetch(`${process.env.REACT_APP_API_URL}/api/users/verify-email?token=${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Verification failed');
          }
          return response.json();
        })
        .then(data => {
          setMessage(data.message || 'Email verified successfully!');
        })
        .catch(error => {
          setMessage(error.message || 'Verification failed. The link may have expired.');
        });
    } else {
      setMessage('No verification token found.');
    }
  }, [location.search]);

  const handleSignUpRedirect = () => {
    navigate('/login'); // Navigate to /signup when the button is clicked
  };

  return (
    <>
      <Header /> {/* Render the Header component */}
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <h3>{message}</h3>
          <p>Login to your account to continue profile creation</p>
          <button onClick={handleSignUpRedirect} className="btn btn-primary mt-3">
            Go to login
          </button>
        </div>
      </div>
    </>
  );
}

export default EmailVerification;

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function EmailVerification() {
  const [message, setMessage] = useState('Verifying your email...');
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    if (token) {
      // Use fetch to send the token to the backend for verification
      fetch(`/api/verify-email?token=${token}`, {
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

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h3>{message}</h3>
      </div>
    </div>
  );
}

export default EmailVerification;

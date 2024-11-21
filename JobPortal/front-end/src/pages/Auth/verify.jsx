import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/header_unverified1'; 

function EmailVerification() {
  const [message, setMessage] = useState('Verifying your email...');
  const location = useLocation();
  const navigate = useNavigate(); 

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    if (token) {
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
    navigate('/login'); 
  };

  return (
    <>
      <Header /> 
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow-lg p-4" style={{ maxWidth: '500px', width: '100%' }}>
          <div className="card-body text-center">
            <h2 className="card-title mb-4 text-primary">Email Verification</h2>
            <p className="card-text fs-5">{message}</p>
            <p className="text-muted">Login to your account to continue profile creation</p>
            <button onClick={handleSignUpRedirect} className="btn btn-primary mt-3 px-4">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmailVerification;

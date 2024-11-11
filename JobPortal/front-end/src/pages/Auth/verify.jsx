import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/empheader'; // Import the Header component

function EmailVerification() {
  const [message, setMessage] = useState('Verifying your email...');
  const [userType, setUserType] = useState(null);
  const [userId, setUserId] = useState(null); // State for storing user_id
  const location = useLocation();
  const navigate = useNavigate();

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
          setUserType(data.usertype); // Set usertype from backend response
          setUserId(data.user_id); // Set user_id from backend response
        })
        .catch(error => {
          setMessage(error.message || 'Verification failed. The link may have expired.');
        });
    } else {
      setMessage('No verification token found.');
    }
  }, [location.search]);

  const handleNextStep = () => {
    if (userType === 'jobseeker') {
      navigate('/j_profilecreation');
    } else if (userType === 'employer') {
      navigate('/e_profilecreation');
    }
  };

  return (
    <>
      <Header /> {/* Render the Header component */}
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <h3>{message}</h3>
          {userType && (
            <button onClick={handleNextStep} className="btn btn-primary mt-3">
              Continue to Profile Creation
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default EmailVerification;

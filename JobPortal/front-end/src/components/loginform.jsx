import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, { // Updated URL to match backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include credentials (for cookies and session)
      });

      const data = await response.json();

      if (response.ok) {
        // Store user details in session storage
        sessionStorage.setItem('user_id', data.user.user_id);
        sessionStorage.setItem('email', data.user.email);
        sessionStorage.setItem('usertype', data.user.usertype);

        // Navigate to the appropriate URL
        navigate(data.redirectUrl);
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <form className="col-lg-6 d-flex align-items-center" onSubmit={handleClick}>
      <div className="card p-5 shadow-lg w-100">
        <h2 className="text-center mb-4">Log in</h2>
        <div className="text-center mb-4 d-flex align-items-center justify-content-center">
          <hr className="w-25" />
          <span className="mx-2">Log in with email</span>
          <hr className="w-25" />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label htmlFor="emailInput" className="form-label">Email Address</label>
          <input
            type="email"
            className="form-control form-control-lg"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="emailInput"
            aria-label="Enter your email address"
          />
        </div>
        <div className="mb-3 position-relative">
  <label htmlFor="passwordInput" className="form-label">Password</label>
  <div className="input-group">
    <input
      type={showPassword ? 'text' : 'password'}
      className="form-control form-control-lg"
      placeholder="Enter password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      id="passwordInput"
      aria-label="Enter your password"
    />
    <span
      className="input-group-text"
      style={{ cursor: 'pointer' }}
      onClick={() => setShowPassword(!showPassword)}
    >
      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
    </span>
  </div>
</div>
        <button className="btn btn-primary btn-lg w-100" type="submit">Login</button>
        <div className="text-center mt-3">
          <span>Don’t have an account?</span>
          <button 
            onClick={handleSignupClick} 
            className="btn btn-link ms-2" 
            style={{ textDecoration: 'underline', padding: 0, border: 'none', background: 'transparent', color: 'blue' }}
          >
            Sign Up
          </button>
        </div>
      </div>
    </form>
  );
}

export default LoginForm;

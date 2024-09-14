import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/api/users/login', { // Updated URL to match backend
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
  
  
  return (
    <form className="col-lg-6 d-flex align-items-center" onSubmit={handleClick}>
      <div className="card p-5 shadow-lg w-100">
        <h2 className="text-center mb-4">Log in</h2>
        <div className="text-center mb-4">
          <hr className="w-25 d-inline-block" />
          <span className="mx-2">Log in with email</span>
          <hr className="w-25 d-inline-block" />
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
        <div className="mb-3">
          <label htmlFor="passwordInput" className="form-label">Password</label>
          <input
            type="password"
            className="form-control form-control-lg"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="passwordInput"
            aria-label="Enter your password"
          />
        </div>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="rememberMe"
          />
          <label className="form-check-label" htmlFor="rememberMe">
            Remember me
          </label>
        </div>
        <button className="btn btn-primary btn-lg w-100" type="submit">Login</button>
        <div className="text-center mt-3">
          <span>Don’t have an account?</span>
          <a href="/signup" className="ms-2">Sign Up</a>
        </div>
      </div>
    </form>
  );
}

export default LoginForm;

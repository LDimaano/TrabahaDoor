import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function SignupForm({ openTermsModal, openPrivacyModal }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUserType] = useState('jobseeker');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isValidLength = password.length >= 8;

    if (!isValidLength) {
      return 'Password must be at least 8 characters long.';
    } else if (!hasUpperCase) {
      return 'Password must include at least one uppercase letter.';
    } else if (!hasLowerCase) {
      return 'Password must include at least one lowercase letter.';
    } else if (!hasNumber) {
      return 'Password must include at least one number.';
    }

    return '';
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
  };

  const handleLoginClick = () => {
    navigate('/login'); 
  };

  const handleClick = async (event) => {
    event.preventDefault();

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/submit-form`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, usertype }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        const userId = result.userId;
  
        if (!userId) {
          setError('User ID is missing from the response.');
          return;
        }
  
        sessionStorage.setItem('userId', userId);
        navigate(usertype === 'jobseeker' ? `/j_profilecreation?userId=${userId}` : `/e_profilecreation?userId=${userId}`);
      } else {
        setError(result.error || 'Error submitting form.');
      }
    } catch (error) {
      console.error('Network or server error:', error);
      setError('Network error. Please try again.');
    }
  };

  return (
    <form className="col-lg-6 d-flex align-items-center" onSubmit={handleClick}>
      <div className="card p-5 shadow-lg w-100">
        <h2 className="text-center mb-4">Sign up Now</h2>
        <div className="text-center mb-4 d-flex align-items-center justify-content-center">
          <hr className="w-25" />
          <span className="mx-2">Sign up with email</span>
          <hr className="w-25" />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label htmlFor="emailInput" className="form-label">Email Address</label>
          <input 
            type="email" 
            className="form-control form-control-lg" 
            placeholder="Enter your Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="emailInput" 
            aria-label="Enter your Email Address"
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
              onChange={handlePasswordChange}
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
          {passwordError && <small className="text-danger">{passwordError}</small>}
          <small className="text-muted">
            Password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one number.
          </small>
        </div>
        <div className="mb-3">
          <label className="form-check-label me-3">
            <input 
              type="radio" 
              name="usertype" 
              value="jobseeker" 
              checked={usertype === 'jobseeker'} 
              onChange={() => setUserType('jobseeker')}
              className="form-check-input me-1"
            />
            Job Seeker
          </label>
          <label className="form-check-label">
            <input 
              type="radio" 
              name="usertype" 
              value="employer" 
              checked={usertype === 'employer'} 
              onChange={() => setUserType('employer')}
              className="form-check-input me-1"
            />
            Employer
          </label>
        </div>
        <button className="btn btn-primary btn-lg w-100" type="submit">Continue</button>
        <div className="text-center mt-3">
          <span>Already have an account?</span>
          <button 
            onClick={handleLoginClick} 
            className="btn btn-link ms-2" 
            style={{ textDecoration: 'underline', padding: 0, border: 'none', background: 'transparent', color: 'blue' }}
          >
            Log in
          </button>
        </div>
        <div className="text-center mt-3">
          <p>
            By clicking 'Continue', you acknowledge that you have read and accept the 
            <a href="#" className="ms-1" onClick={openTermsModal}>Terms of Service</a> and 
            <a href="#" className="ms-1" onClick={openPrivacyModal}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </form>
  );
}

export default SignupForm;

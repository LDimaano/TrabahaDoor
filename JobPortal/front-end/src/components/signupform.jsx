import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function SignupForm({ openTermsModal, openPrivacyModal }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [usertype, setUserType] = useState('jobseeker');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState(''); 
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isValidLength = password.length >= 8;

    if (!isValidLength) return 'Password must be at least 8 characters long.';
    if (!hasUpperCase) return 'Password must include at least one uppercase letter.';
    if (!hasLowerCase) return 'Password must include at least one lowercase letter.';
    if (!hasNumber) return 'Password must include at least one number.';
    return '';
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const validationError = validatePassword(newPassword);
    setPasswordError(validationError);

    if (!validationError) {
      setConfirmPasswordError(
        newPassword === confirmPassword ? '' : 'Passwords do not match.'
      );
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    if (!passwordError) {
      setConfirmPasswordError(
        password === newConfirmPassword ? '' : 'Passwords do not match.'
      );
    }
  };

  const handleClick = async (event) => {
    event.preventDefault();

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
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
        navigate('/unverified-account'); 
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
        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage ? (
          <div className="alert alert-success">{successMessage}</div>
        ) : (
          <>
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
                  className={`form-control form-control-lg ${passwordError ? 'is-invalid' : ''}`}
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
              {!passwordError && (
                <small className="text-muted">
                  Password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one number.
                </small>
              )}
            </div>
            <div className="mb-3 position-relative">
              <label htmlFor="confirmPasswordInput" className="form-label">Confirm Password</label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`form-control form-control-lg ${confirmPasswordError ? 'is-invalid' : ''}`}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  id="confirmPasswordInput"
                  aria-label="Confirm your password"
                  disabled={!!passwordError} // Disable if there's a password error
                />
                <span
                  className="input-group-text"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </span>
              </div>
              {confirmPasswordError && <small className="text-danger">{confirmPasswordError}</small>}
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
          </>
        )}
      </div>
    </form>
  );
}

export default SignupForm;

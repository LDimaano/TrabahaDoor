import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from '../components/modal'; 

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUserType] = useState('jobseeker'); 
  const [isTermsModalOpen, setTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleClick = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/submit-form', {
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
          setError('User ID is missing from response.');
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

  const openTermsModal = (e) => {
    e.preventDefault(); 
    setTermsModalOpen(true);
  };

  const openPrivacyModal = (e) => {
    e.preventDefault();
    setPrivacyModalOpen(true);
  };

  const closeTermsModal = () => setTermsModalOpen(false);
  const closePrivacyModal = () => setPrivacyModalOpen(false);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="container">
        <div className="row">
          <SignupContainer />
          <form className="col-lg-6 d-flex align-items-center" onSubmit={handleClick}>
            <div className="card p-5 shadow-lg w-100">
              <h2 className="text-center mb-4">Sign up Now</h2>
              <div className="text-center mb-4">
                <hr className="w-25 d-inline-block" />
                <span className="mx-2">Sign up with email</span>
                <hr className="w-25 d-inline-block" />
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
                <a href="/login" className="ms-2">Log in</a>
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
        </div>
      </div>

      <Modal 
        isOpen={isTermsModalOpen} 
        onClose={closeTermsModal} 
        content={
          <div>
            <h2>Terms of Service</h2>
            <p><strong>Effective Date:</strong> 2025</p>
            <p>Welcome to Trabahadoor! These Terms of Service govern your use of our website provided by PESO San Jose. By accessing or using our Platform, you agree to be bound by these Terms. If you do not agree, please do not use our Platform.</p>
            <h3>Contact Us</h3>
            <p>If you have any questions about these Terms, please contact us at (email of sanjose).</p>
          </div>
        }
      />
      <Modal 
        isOpen={isPrivacyModalOpen} 
        onClose={closePrivacyModal} 
        content={
          <div>
            <h2>Privacy Policy</h2>
            <p>[Insert your Privacy Policy Content here]</p>
          </div>
        }
      />
    </div>
  );
}

function SignupContainer() {
  return (
    <div className="col-lg-6 d-flex flex-column align-items-center justify-content-center mb-4 mb-lg-0">
      <img 
        src={`${process.env.PUBLIC_URL}/assets/jobfair.jpg`} 
        alt="Illustration of opportunities" 
        className="img-fluid mb-3" 
        loading="lazy" 
        style={{ maxHeight: '600px', objectFit: 'cover' }}
      />
      <h1 className="text-center">Welcome to Trabahadoor!</h1>
      <p className="text-center">See the opportunities awaiting for you</p>
    </div>
  );
}

export default Signup;

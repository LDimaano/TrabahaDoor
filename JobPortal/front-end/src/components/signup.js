import React, { useState } from 'react';
import '../css/login_signup.css';   
import { useNavigate } from 'react-router-dom';
import Modal from './modal'; 

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUserType] = useState('jobseeker'); // Default to 'jobseeker'
  const [isTermsModalOpen, setTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setPrivacyModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleClick = async (event) => {
    event.preventDefault();

    // Debugging: Check userType value
    console.log('Current userType:', usertype);

    try {
      const response = await fetch('http://localhost:5000/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, usertype }), // Ensure userType is included
      });
  
      const result = await response.json();
      
      if (response.ok) {
        console.log('Form submitted successfully:', result);
        navigate(usertype === 'jobseeker' ? '/signup_jobseeker' : '/signup_employer');
      } else {
        console.error('Error submitting form:', result.error);
      }
    } catch (error) {
      console.error('Network or server error:', error);
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
    <section className="loginContainer">
      <div className="flexContainer">
        <LoginContainer />
        <form className="formContainer" onSubmit={handleClick}>
          <div className="loginForm">
            <h2 className="welcomeText">Sign up Now</h2>
            <div className="dividerSection">
              <div className="dividerLine" />
              <p className="dividerText">Sign up with email</p>
              <div className="dividerLine" />
            </div>
            <div className="forms">
              <label className="textFieldGroup">
                <span className="textFieldLabel">Email Address</span>
                <input 
                  type="email" 
                  className="textFieldInput" 
                  placeholder="Enter your Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="emailInput" 
                  aria-label="Enter your Email Address"
                />
              </label>
              <label className="textFieldGroup">
                <span className="textFieldLabel">Password</span>
                <input 
                  type="password" 
                  className="textFieldInput" 
                  placeholder="Enter password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="passwordInput" 
                  aria-label="Enter your password"
                />
              </label>
              <div className="userTypeContainer">
                <label className="radioGroup">
                  <input 
                    type="radio" 
                    name="usertype" 
                    value="jobseeker" 
                    checked={usertype === 'jobseeker'} 
                    onChange={() => setUserType('jobseeker')}
                  />
                  <span>Job Seeker</span>
                </label>
                <label className="radioGroup">
                <input 
                    type="radio" 
                    name="usertype" 
                    value="employer" 
                    checked={usertype === 'employer'} 
                    onChange={() => setUserType('employer')}
                  />
                  <span>Employer</span>
                </label>
              </div>
              <button className="submitButton" type="submit">Continue</button>
            </div>
            <div className="alreadyAccount">
              <span>Already have an account?</span>
              <a href="/login" className="signUpLink">Log in</a>
            </div>
            <div className="alreadyAccount">
              <p>
                By clicking 'Continue', you acknowledge that you have read and accept the 
                <a href="/terms-of-service" className="signUpLink" onClick={openTermsModal}> Terms of Service</a> and 
                <a href="/privacy-policy" className="signUpLink" onClick={openPrivacyModal}> Privacy Policy</a>.
              </p>
            </div>
          </div>
        </form>
      </div>

      <Modal 
        isOpen={isTermsModalOpen} 
        onClose={closeTermsModal} 
        content={
          <div>
            <h2>Terms of Service</h2>
            <p><strong>Effective Date:</strong> 2025</p>
            <p>Welcome to Trabahadoor! These Terms of Service govern your use of our website provided by PESO San Jose. By accessing or using our Platform, you agree to be bound by these Terms. If you do not agree, please do not use our Platform.</p>
            {/* Other Terms of Service content */}
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
            {/* Privacy Policy Content */}
          </div>
        }
      />
    </section>
  );
}

function LoginContainer() {
  return (
    <div className="infoContainer">
      <img 
        src={`${process.env.PUBLIC_URL}/assets/jobfair.jpg`} 
        alt="Illustration of opportunities" 
        className="imageResponsive" 
        loading="lazy" 
      />
      <h1 className="headerText">Welcome to Trabahadoor!</h1>
      <p className="subHeaderText">See the opportunities awaiting for you</p>
    </div>
  );
}

export default Signup;

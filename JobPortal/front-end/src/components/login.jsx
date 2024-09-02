import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/login_signup.css';
import Modal from './modal'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect based on usertype
        navigate(data.redirectUrl);
      } else {
        setError(data.message);
        setIsModalOpen(true); // Open the modal on login failure
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setError('Something went wrong. Please try again.');
      setIsModalOpen(true); // Open the modal on error
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(''); // Clear the error message when closing the modal
  };

  return (
    <section className="loginContainer">
      <div className="flexContainer">
        <LoginContainer />
        <form className="formContainer" onSubmit={handleClick}>
          <div className="loginForm">
            <h2 className="welcomeText">Log in</h2>
            <div className="dividerSection">
              <div className="dividerLine" />
              <p className="dividerText">Log in with email</p>
              <div className="dividerLine" />
            </div>
            <div className="forms">
              <label className="textFieldGroup">
                <span className="textFieldLabel">Email Address</span>
                <input
                  type="email"
                  className="textFieldInput"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="emailInput"
                  aria-label="Enter your email address"
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
              <div className="rememberMeContainer">
                <label className="checkboxContainer">
                  <input
                    type="checkbox"
                    className="checkboxInput"
                  />
                  <span className="checkboxLabel">Remember me</span>
                </label>
              </div>
              <button className="submitButton" type="submit">Login</button>
            </div>
            <div className="alreadyAccount">
              <span>Don’t have an account?</span>
              <a href="/signup" className="signUpLink">Sign Up</a>
            </div>
          </div>
        </form>
      </div>

      {/* Login Failed Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} content={
        <div>
          <h2>Login Failed</h2>
          <p>{error}</p>
          <button className="modalButton" onClick={handleCloseModal}>Close</button>
        </div>
      } />
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
      <p className="subHeaderText">See the opportunities awaiting you</p>
    </div>
  );
}

export default Login;

import React from 'react';
import '../css/login_signup.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleClick = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('Form submitted successfully:', result);
        // Redirect to another page after successful login
        navigate('/dashboard'); // Replace '/dashboard' with the desired route
      } else {
        console.error('Error submitting form:', result.error);
      }
    } catch (error) {
      console.error('Network or server error:', error);
    }
  };
  return (
    <section className="loginContainer">
      <div className="flexContainer">
        <LoginContainer/>
        <form className="formContainer">
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
              <button className="submitButton" type="submit" onClick={handleClick}>Login</button>
            </div>
              <div className="alreadyAccount">
                <span>Don’t have an account?</span>
                <a href="/signup" className="signUpLink">Sign Up</a>
              </div>
          </div>
        </form>
      </div>
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

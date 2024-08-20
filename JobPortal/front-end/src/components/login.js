import React from 'react';
import '../css/login_signup.css';   
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/home_jobseeker'); 
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
        <p className="subHeaderText">See the opportunities awaiting for you</p>
      </div>
  );
};
export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/login_signup.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <section className={styles.loginContainer}>
      <div className={styles.flexContainer}>
        <LoginContainer />
        <form className={styles.formContainer} onSubmit={handleClick}>
          <div className={styles.loginForm}>
            <h2 className={styles.welcomeText}>Log in</h2>
            <div className={styles.dividerSection}>
              <div className={styles.dividerLine} />
              <p className={styles.dividerText}>Log in with email</p>
              <div className={styles.dividerLine} />
            </div>
            <div className={styles.forms}>
              {error && <div className={styles.errorMessage}>{error}</div>}
              <label className={styles.textFieldGroup}>
                <span className={styles.textFieldLabel}>Email Address</span>
                <input
                  type="email"
                  className={styles.textFieldInput}
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="emailInput"
                  aria-label="Enter your email address"
                />
              </label>
              <label className={styles.textFieldGroup}>
                <span className={styles.textFieldLabel}>Password</span>
                <input
                  type="password"
                  className={styles.textFieldInput}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="passwordInput"
                  aria-label="Enter your password"
                />
              </label>
              <div className={styles.rememberMeContainer}>
                <label className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    className={styles.checkboxInput}
                  />
                  <span className={styles.checkboxLabel}>Remember me</span>
                </label>
              </div>
              <button className={styles.submitButton} type="submit">Login</button>
            </div>
            <div className={styles.alreadyAccount}>
              <span>Don’t have an account?</span>
              <a href="/signup" className={styles.signUpLink}>Sign Up</a>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

function LoginContainer() {
  return (
    <div className={styles.infoContainer}>
      <img
        src={`${process.env.PUBLIC_URL}/assets/jobfair.jpg`}
        alt="Illustration of opportunities"
        className={styles.imageResponsive}
        loading="lazy"
      />
      <h1 className={styles.headerText}>Welcome to Trabahadoor!</h1>
      <p className={styles.subHeaderText}>See the opportunities awaiting you</p>
    </div>
  );
}

export default Login;

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignupContainer from '../../components/signupcontainer'; // Adjust path as needed
import LoginForm from '../../components/loginform';

function Login() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="container">
        <div className="row">
          <SignupContainer />
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default Login;


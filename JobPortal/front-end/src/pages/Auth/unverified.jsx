import React from 'react';
import Header from '../../components/empheader'; // Import the Header component

function EmailCheckReminder() {
  return (
    <>
      <Header /> 
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <h3>Please Verify Your Email</h3>
          <p className="mt-3">
            We’ve sent a verification link to your email address. Please check your inbox to complete the verification process.
          </p>
          <p className="mt-2 text-muted">
            If you don’t see the email, please check your spam or junk folder.
          </p>
          <p className="mt-2">
            Once verified, you can continue to set up your profile. 
          </p>
          <p className="text-center">
          For further questions, contact: 
          <a href="mailto:trabahadoor.sanjose@gmail.com"> trabahadoor.sanjose@gmail.com</a>
        </p>
        </div>
      </div>
    </>
  );
}

export default EmailCheckReminder;

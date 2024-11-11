import React from 'react';
import Header from '../../components/header_unverified'; // Import the Header component

function EmailCheckReminder() {
  return (
    <>
      <Header />
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow-lg p-4" style={{ maxWidth: '600px', width: '100%' }}>
          <div className="card-body text-center">
            <h2 className="card-title mb-3 text-primary">Please Verify Your Email</h2>
            <p className="card-text fs-5 mb-4">
              We’ve sent a verification link to your email address. Please check your inbox to complete the verification process.
            </p>
            <p className="text-muted">
              If you don’t see the email, please check your spam or junk folder.
            </p>
            <p className="mt-3">
              Once verified, you can continue to set up your profile.
            </p>
            <p className="mt-4 text-center">
              <span className="text-muted">For further questions, contact: </span>
              <a href="mailto:trabahadoor.sanjose@gmail.com" className="text-decoration-none">
                trabahadoor.sanjose@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmailCheckReminder;

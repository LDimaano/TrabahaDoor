import React from 'react';

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

export default SignupContainer;

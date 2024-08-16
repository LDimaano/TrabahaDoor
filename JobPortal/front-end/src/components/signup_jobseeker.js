import React from 'react';
import '../css/signup_jobseeker.css';   
import { useNavigate } from 'react-router-dom';

const JobSeekerRegistration = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/signup_jobseeker2'); 
    };
  
    return (
    <main className="container">
      <header className="header">
        <img 
          loading="lazy" 
          src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`} 
          className="logo" 
          alt="TrabahaDoor logo" 
        />
        <h1 className="brandName">TrabahaDoor</h1>
      </header>
      
      <h2 className="title">
        Hello there! Looking for new job opportunities?
      </h2>
      
      <p className="subtitle">
        Search for people, and job opportunities in your area
      </p>
      
      <form className="form">
        <div className="inputGroup">
          <label htmlFor="firstName" className="label">First name*</label>
          <input 
            type="text" 
            id="firstName" 
            className="input" 
            placeholder="Juan" 
            required 
          />
        </div>
        
        <div className="inputGroup">
          <label htmlFor="lastName" className="label">Last name*</label>
          <input 
            type="text" 
            id="lastName" 
            className="input" 
            placeholder="Dela Cruz" 
            required 
          />
        </div>
        
        <button type="button" className="submitButton" onClick={handleClick}>
        Next
        </button>
      </form>
    </main>
  );
};

export default JobSeekerRegistration;

import React from 'react';
import '../css/signup_jobseeker.css';   
import { useNavigate } from 'react-router-dom';

const JobSeekerRegistration = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/signup_jobseeker3'); 
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
      Welcome, What is your location?
      </h2>
      
      <p className="subtitle">
        Search for people, and job opportunities in your area
      </p>
      
      <form className="form">
        <div className="inputGroup">
          <label htmlFor="location" className="label">Location*</label>
          <input 
            type="text" 
            id="firstName" 
            className="input" 
            placeholder="San Jose, Batangas" 
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

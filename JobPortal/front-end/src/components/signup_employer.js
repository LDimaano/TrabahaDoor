import React from 'react';
import '../css/signup_jobseeker.css';   
import { useNavigate } from 'react-router-dom';

const Empform = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/signup_employer2'); 
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
        Hello there! Looking for qualified candidates?
      </h2>
      
      <p className="subtitle">
      Search for potential employees and talents in your area
      </p>
      
      <form className="form">
        <div className="inputGroup">
          <label htmlFor="companyname" className="label">Company name*</label>
          <input 
            type="text" 
            id="cname" 
            className="input" 
            placeholder="Saint Anthony Montessori" 
            required 
          />
        </div>
        
        <div className="inputGroup">
          <label htmlFor="location" className="label">Location*</label>
          <input 
            type="text" 
            id="emplocation" 
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

export default Empform;

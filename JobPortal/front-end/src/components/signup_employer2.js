import React from 'react';
import '../css/signup_jobseeker.css';   
import { useNavigate } from 'react-router-dom';

const Empform = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/signup_employer3'); 
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
              <label htmlFor="industry" className="label">Industry*</label>
              <input 
                type="text" 
                id="industry" 
                className="input" 
                placeholder="Technology" 
                required 
              />
            </div>
            
            <div className="inputGroup">
             <label htmlFor="datefounded" className="label">Date Founded*</label>
             <div className="datePickerWrapper">
            <input 
                type="date" 
                id="datefounded" 
                className="input" 
                placeholder="09/08/2020" 
                required 
            />
            </div>
            </div>
            
            <div className="inputGroup">
              <label htmlFor="companydescription" className="label">Description*</label>
              <textarea 
                id="companydescription" 
                className="inputcalendar" 
                placeholder="Briefly describe your company" 
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

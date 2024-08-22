import React, { useState } from 'react';
import '../css/signup_jobseeker.css';   
import { useNavigate } from 'react-router-dom';

const JobSeekerRegistration = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/register-jobseeker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName }),
      });

      if (response.ok) {
        navigate('/signup_jobseeker2');
      } else {
        console.error('Error registering job seeker');
      }
    } catch (error) {
      console.error('Network or server error:', error);
    }
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
      
      <form className="form" onSubmit={handleSubmit}>
        <div className="inputGroup">
          <label htmlFor="firstName" className="label">First name*</label>
          <input 
            type="text" 
            id="firstName" 
            className="input" 
            placeholder="Juan" 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
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
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required 
          />
        </div>
        
        <button type="submit" className="submitButton">
          Next
        </button>
      </form>
    </main>
  );
};

export default JobSeekerRegistration;

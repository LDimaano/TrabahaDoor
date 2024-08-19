import React from "react";
import '../css/signup_jobseeker.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation

const JobSeekerRegistration = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleClick = () => {
    navigate('/home'); // Navigate to the '/home' route on button click
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
        What type of job are you searching for?
      </h2>
      
      <p className="subtitle">
        You can select up to 5 job titles
      </p>
      
      <form>
        <label htmlFor="jobTitles" className="label">Job titles*</label>
        <input 
          type="text" 
          id="jobTitles" 
          className="input" 
          placeholder="Staff Nurse" 
          aria-label="Enter job titles"
        />
        <button type="button" className="submitButton" onClick={handleClick}>Next</button>
      </form>
    </main>
  );
}

export default JobSeekerRegistration;

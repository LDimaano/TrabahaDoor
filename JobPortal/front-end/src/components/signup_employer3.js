import React from 'react';
import '../css/signup_jobseeker.css';   
import { useNavigate } from 'react-router-dom';

const JobSeekerRegistration = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/'); 
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
        What type of applicant are you searching for?
      </h2>
      
      <p className="subtitle">
        Search for potential employees and talents in your area
      </p>

      <form className="form">
            <div className="inputGroup">
              <label htmlFor="industry" className="label">Jobtitle*</label>
              <input 
                type="text" 
                id="Jobtitle" 
                className="input" 
                placeholder="Staff Nurse" 
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

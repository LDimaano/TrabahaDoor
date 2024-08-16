import React from 'react';
import '../css/signup_jobseeker.css';   
import { useNavigate } from 'react-router-dom';

const JobSeekerRegistration = () => {
  
  const navigate = useNavigate();

  const handleStudentClick = () => {
    navigate('/signup_jstudent');
  };

  const handleClick = () => {
    navigate('/signup_jobseeker4'); 
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
      Help us to know you better by building your job profile to discover job opportunities
      </h2>
           
      <form className="form">
      <div className="inputGroup">
        <label htmlFor="currentJobTitle" className="label">Current job title*</label>
        <input 
          type="text" 
          id="currentJobTitle" 
          className="input" 
          placeholder="Staff Nurse" 
          required 
        />
      </div>
      <span 
        className="studentLink" 
        onClick={handleStudentClick}
      >
        I am a student
      </span>
      <button type="button" className="submitButton" onClick={handleClick}>
        Next
        </button>
    </form>
    </main>
  );
};

export default JobSeekerRegistration;

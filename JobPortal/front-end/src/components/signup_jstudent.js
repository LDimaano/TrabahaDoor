import React from 'react';
import '../css/signup_jobseeker.css';     
import { useNavigate } from 'react-router-dom'; 

const JobSeekerRegistration = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/signup_jobseeker4');
  };

  const handleClick = () => {
    navigate('/signup_jobseeker5'); 
  };

  // Header Component
  const Header = () => (
    <header className="header">
    <img 
      loading="lazy" 
      src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`} 
      className="logo" 
      alt="TrabahaDoor logo" 
    />
    <h1 className="brandName">TrabahaDoor</h1>
  </header>
  );

  // TextField Component
  const TextField = ({ label, inputValue }) => (
    <div className="textField">
      <label className="label" htmlFor={label}>
        {label}
      </label>
      <input
        id={label}
        type="text"
        className="input"
        value={inputValue}
        readOnly
        aria-label={label}
      />
    </div>
  );

  // PrimaryButton Component
  const PrimaryButton = ({ text, onClick }) => (
    <button type="button" className="submitButton" onClick={onClick}>
      {text}
    </button>
  );

  // SecondaryButton Component
  const SecondaryButton = ({ text, onClick }) => (
    <button type="button" className="secondaryButton" onClick={onClick}>
      {text}
    </button>
  );

  return (
    <section className="container">
      <Header />
      <p className="title">
        Help us to know you better by building your job profile
  
        to discover job opportunities
      </p>
      <form className="form">
        <TextField label="School/University *" inputValue="Staff Nurse" />
        <TextField label="Year Level *" inputValue="Staff Nurse" />
        <TextField label="Specialization *" inputValue="Staff Nurse" />
        <SecondaryButton text="I am not a student" onClick={handleBackClick} />
        <PrimaryButton text="Next" onClick={handleClick} />
      </form>
    </section>
  );
};

export default JobSeekerRegistration;

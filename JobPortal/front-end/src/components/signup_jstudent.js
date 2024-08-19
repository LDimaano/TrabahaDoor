import React from 'react';
import '../css/student_reg.css';  
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
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/9a041a0749592ac4adcd0d49d215ec305d8ef2b8bfa04e2e12bc81be88b68fe4?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
        alt="TrabahaDoor logo"
        className="logo-image"
      />
      <div className="tagline">TrabahaDoor</div>
    </header>
  );

  // TextField Component
  const TextField = ({ label, inputValue }) => (
    <div className="textfield">
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
    <button type="button" className="button-primary" onClick={onClick}>
      {text}
    </button>
  );

  // SecondaryButton Component
  const SecondaryButton = ({ text, onClick }) => (
    <button type="button" className="button-secondary" onClick={onClick}>
      {text}
    </button>
  );

  return (
    <section className="student-registration">
      <Header />
      <p className="description">
        Help us to know you better by building your job profile
        <br />
        to discover job opportunities
      </p>
      <form className="form-container">
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

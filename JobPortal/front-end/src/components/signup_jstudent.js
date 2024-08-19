import React from "react";
import '../css/student_reg.css';  
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
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/9a041a0749592ac4adcd0d49d215ec305d8ef2b8bfa04e2e12bc81be88b68fe4?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
          className="logo"
          alt="TrabahaDoor logo"
        />
        <h1 className="brandName">TrabahaDoor</h1>
      </header>
      <h2 className="title">
        Help us to know you better by building your job profile <br />
        to discover job opportunities
      </h2>
      <form>
        <div className="formGroup">
          <label htmlFor="school" className="label">School or College/University *</label>
          <input id="school" type="text" className="input" placeholder="Staff Nurse" />
        </div>
        <div className="dateGroup">
          <label htmlFor="yearStarted" className="dateLabel">Year Started *</label>
          <label htmlFor="yearFinished" className="dateLabel">Year Finished *</label>
        </div>
        <div className="dateInputGroup">
          <div className="dateInputWrapper">
            <input id="yearStarted" type="text" className="dateInput" placeholder="-" />
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/54db89ea934bc5bae064c0ebba09ca70f2d78933dfa766cc5cd0c519b40674b3?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
              className="dateIcon"
              alt=""
            />
          </div>
          <div className="dateInputWrapper">
            <input id="yearFinished" type="text" className="dateInput" placeholder="-" />
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/adbbdbcc7d1c0710a88c6a76d23ce31a7c0326a78ffcd72524f8c1046bf4e030?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
              className="dateIcon"
              alt=""
            />
          </div>
        </div>
        <div className="checkboxGroup">
          <label htmlFor="ageConfirmation" className="checkboxLabel">
            I am 18 years old and above
          </label>
          <input type="checkbox" id="ageConfirmation" className="checkbox" />
        </div>
        <button type="button" className="submitButton" onClick={handleClick}>
          I am not a student
        </button>
        <button type="submit" className="primaryButton">Next</button>
      </form>
    </main>
  );
}

export default JobSeekerRegistration;

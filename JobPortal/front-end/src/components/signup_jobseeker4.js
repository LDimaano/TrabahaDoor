import React from 'react';
import '../css/jobprofile.css';  
import { useNavigate } from 'react-router-dom'; 

const JobSeekerRegistration = () => {
  
  const navigate = useNavigate();

  const handleStudentClick = () => {
    navigate('/signup_jstudent');
  };

  const handleClick = () => {
    navigate('/signup_jobseeker5'); 
  };

  return (
    <main className="jobProfileForm">
      <Header />
      <h1 className="formTitle">
        Help us to know you better by building your job profile
        <br />
        to discover job opportunities
      </h1>
      <form className="form">
        <TextField
          label="Current job title *"
          placeholder="Staff Nurse"
          id="jobTitle"
        />
        <div className="formRow">
          <SelectField
            label="Type of Work *"
            options={['Choose 1']}
            id="workType"
          />
          <TextField
            label="Previous Salary"
            placeholder="Salary Range"
            id="previousSalary"
          />
        </div>
        <SelectField
          label="Industry"
          options={['Healthcare and Medicine']}
          id="industry"
        />
        <TextField
          label="Most recent company *"
          placeholder=""
          id="recentCompany"
        />
        <Button variant="secondary" type="button" onClick={handleStudentClick}>
          I am a student
        </Button>
        <Button variant="primary" type="submit" onClick={handleClick}>
          Next
        </Button>
      </form>
    </main>
  );
};

// Header component
const Header = () => {
  return (
    <header className="header">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/9a041a0749592ac4adcd0d49d215ec305d8ef2b8bfa04e2e12bc81be88b68fe4?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
        alt="TrabahaDoor logo"
        className="logo"
      />
      <h2 className="brandName">TrabahaDoor</h2>
    </header>
  );
};

// TextField component
const TextField = ({ label, placeholder, id }) => {
  return (
    <div className="textField">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input
        type="text"
        id={id}
        className="input"
        placeholder={placeholder}
      />
    </div>
  );
};

// SelectField component
const SelectField = ({ label, options, id }) => {
  return (
    <div className="selectField">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="selectWrapper">
        <select id={id} className="select">
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/3bb70b8683df86cbfacf5265fe402a6d5f7870403b7b41189714c89c06c388ef?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
          alt=""
          className="arrow"
        />
      </div>
    </div>
  );
};

const Button = ({ children, variant, type }) => {
  return (
    <button className={`button ${variant}`} type={type}>
      {children}
    </button>
  );
};

export default JobSeekerRegistration;

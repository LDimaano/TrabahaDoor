import React from 'react';
import '../css/signup_jobseeker.css';   
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
    <main className="container">
      <Header />
      <h1 className="title">
        Help us to know you better by building your job profile
      
        to discover job opportunities
      </h1>
      <form className="form">
        <div className="inputGroup">
          <label htmlFor="jobtitle" className="label">Current job title*</label>
          <input 
            type="text" 
            id="jtitle" 
            className="input" 
            placeholder="Staff Nurse" 
            // required 
          />
        </div>
        <div className="inputGroup">
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
        <button type="button" className="secondaryButton" onClick={handleStudentClick}>
          I am a student
        </button>
        <button type="button" className="submitButton" onClick={handleClick}>
              Next
        </button>
      </form>
    </main>
  );
};

const Header = () => {
  return (
    <header className="header">
      <img
        src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`} 
        alt="TrabahaDoor logo"
        className="logo"
      />
      <h2 className="brandName">TrabahaDoor</h2>
    </header>
  );
};

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


export default JobSeekerRegistration;

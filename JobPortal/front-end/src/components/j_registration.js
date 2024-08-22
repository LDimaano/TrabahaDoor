import React, { useState } from 'react';
import '../css/j_registration.css';   
import { useNavigate } from 'react-router-dom';

// FormInput Component
const FormInput = ({ label, value, type = 'text', onChange, id, placeholder, ariaLabel }) => {
  return (
    <div className="inputWrapper">
      <label className="label" htmlFor={id}>{label}</label>
      <input
        className="input"
        type={type}
        value={value}
        onChange={onChange}
        id={id}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
    </div>
  );
};

// FormRow Component
const FormRow = ({ children }) => {
  return <div className="formRow">{children}</div>;
};

// Main Component
function JobSeekerRegistration() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [location, setLocation] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [workType, setWorkType] = useState('Choose 1');
    const [salary, setSalary] = useState('Salary Range');
    const [industry, setIndustry] = useState('Healthcare and Medicine');
    const [company, setCompany] = useState('');

    const navigate = useNavigate();
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      // Ensure all form fields are included in the request
      const formData = {
        firstName,
        lastName,
        location,
        jobTitle,
        workType,
        salary,
        industry,
        company,
      };
  
      try {
        const response = await fetch('http://localhost:5000/register-jobseeker', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
    
        const result = await response.json();
        
        if (response.ok) {
          console.log('Form submitted successfully:', result);
          navigate('/j_registration'); // Or wherever you want to navigate
        } else {
          console.error('Error submitting form:', result.error);
        }
      } catch (error) {
        console.error('Network or server error:', error);
      }
    };

  return (
    <main className="r-container">
      <header className="r-header">
        <img 
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/9a041a0749592ac4adcd0d49d215ec305d8ef2b8bfa04e2e12bc81be88b68fe4?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
          className="logo"
          alt="TrabahaDoor logo"
        />
        <div className="brandName">TrabahaDoor</div>
      </header>
      <h1 className="title">Hello there! Looking for new job opportunities?</h1>
      <p className="subtitle">Search for people, and job opportunities in your area</p>
      <form onSubmit={handleSubmit}>
        <FormRow>
          <div className="formGroup">
            <FormInput 
              label="First name*" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              id="fname" 
              placeholder="Juan" 
              ariaLabel="Enter your first name"
            />
          </div>
          <div className="formGroup">
            <FormInput 
              label="Last name*" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              id="lname" 
              placeholder="Dela Cruz" 
              ariaLabel="Enter your last name"
            />
          </div>
        </FormRow>
        <FormRow>
          <div className="formGroup">
            <FormInput 
              label="Location*" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              id="location" 
              placeholder="San Jose, Batangas" 
              ariaLabel="Enter your location"
            />
          </div>
          <div className="formGroup">
            <FormInput 
              label="Current job title *" 
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              id="jobtitle" 
              placeholder="Staff Nurse" 
              ariaLabel="Enter your current job title"
            />
          </div>
        </FormRow>
        <FormRow>
          <div className="formGroup">
            <label className="label" htmlFor="workType">Type of Work *</label>
            <select 
              id="workType" 
              className="select" 
              value={workType} 
              onChange={(e) => setWorkType(e.target.value)}
            >
              <option>Choose 1</option>
              {/* Add more options here if needed */}
            </select>
          </div>
          <div className="formGroup">
            <label className="label" htmlFor="salary">Previous Salary</label>
            <select 
              id="salary" 
              className="select" 
              value={salary} 
              onChange={(e) => setSalary(e.target.value)}
            >
              <option>Salary Range</option>
              {/* Add more options here if needed */}
            </select>
          </div>
        </FormRow>
        <FormRow>
          <div className="formGroup">
            <label className="label" htmlFor="industry">Industry *</label>
            <select 
              id="industry" 
              className="select" 
              value={industry} 
              onChange={(e) => setIndustry(e.target.value)}
            >
              <option>Healthcare and Medicine</option>
              {/* Add more options here if needed */}
            </select>
          </div>
          <div className="formGroup">
            <FormInput 
              label="Most recent company *" 
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              id="company" 
              placeholder="Alorica" 
              ariaLabel="Enter your most recent company"
            />
          </div>
        </FormRow>
        <button type="button" className="secondaryButton">I am a student</button>
        <button type="submit" className="submitButton">Next</button>
      </form>
    </main>
  );
};

export default JobSeekerRegistration;

import React, { useState } from 'react';
import styles from '../css/j_registration.module.css';   
import { useNavigate } from 'react-router-dom';

// FormInput Component
const FormInput = ({ label, value, type = 'text', onChange, id, placeholder, ariaLabel }) => {
  return (
    <div className={styles.inputWrapper}>
      <label className={styles.label} htmlFor={id}>{label}</label>
      <input
        className={styles.input}
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
  return <div className={styles.formRow}>{children}</div>;
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

  const handleStudentClick = () => {
    navigate('/js_registration');
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <img 
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/9a041a0749592ac4adcd0d49d215ec305d8ef2b8bfa04e2e12bc81be88b68fe4?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
          className={styles.logo}
          alt="TrabahaDoor logo"
        />
        <div className={styles.brandName}>TrabahaDoor</div>
      </header>
      <h1 className={styles.title}>Hello there! Looking for new job opportunities?</h1>
      <p className={styles.subtitle}>Search for people, and job opportunities in your area</p>
      <form onSubmit={handleSubmit}>
        <FormRow>
          <div className={styles.formGroup}>
            <FormInput 
              label="First name*" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              id="fname" 
              placeholder="Juan" 
              ariaLabel="Enter your first name"
            />
          </div>
          <div className={styles.formGroup}>
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
          <div className={styles.formGroup}>
            <FormInput 
              label="Location*" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              id="location" 
              placeholder="San Jose, Batangas" 
              ariaLabel="Enter your location"
            />
          </div>
          <div className={styles.formGroup}>
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
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="workType">Type of Work *</label>
            <select 
              id="workType" 
              className={styles.select} 
              value={workType} 
              onChange={(e) => setWorkType(e.target.value)}
            >
              <option>Choose 1</option>
              {/* Add more options here if needed */}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="salary">Previous Salary</label>
            <select 
              id="salary" 
              className={styles.select} 
              value={salary} 
              onChange={(e) => setSalary(e.target.value)}
            >
              <option>Salary Range</option>
              {/* Add more options here if needed */}
            </select>
          </div>
        </FormRow>
        <FormRow>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="industry">Industry *</label>
            <select 
              id="industry" 
              className={styles.select} 
              value={industry} 
              onChange={(e) => setIndustry(e.target.value)}
            >
              <option>Healthcare and Medicine</option>
              {/* Add more options here if needed */}
            </select>
          </div>
          <div className={styles.formGroup}>
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
        <button type="button" className={styles.secondaryButton} onClick={handleStudentClick}>I am a student</button>
        <button type="submit" className={styles.submitButton}>Next</button>
      </form>
    </main>
  );
}

export default JobSeekerRegistration;

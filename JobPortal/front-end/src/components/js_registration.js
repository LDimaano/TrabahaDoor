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
function StudentRegistration() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [location, setLocation] = useState('');
    const [school, setSchool] = useState('');
    const [yearLevel, setYearLevel] = useState('Choose 1');
    const [specialization, setSpecialization] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
      event.preventDefault();

      const formData = {
        firstName,
        lastName,
        location,
        school,
        yearLevel,
        specialization,
      };

      try {
        const response = await fetch('http://localhost:5000/register-student', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        
        if (response.ok) {
          console.log('Form submitted successfully:', result);
          navigate('/js_registration'); // Or wherever you want to navigate
        } else {
          console.error('Error submitting form:', result.error);
        }
      } catch (error) {
        console.error('Network or server error:', error);
      }
    };

    const handleNotStudentClick = () => {
      navigate('/j_registration');
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
                label="School/University*" 
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                id="school" 
                placeholder="Enter your school or university" 
                ariaLabel="Enter your school or university"
              />
            </div>
          </FormRow>
          <FormRow>
            <div className="formGroup">
              <label className="label" htmlFor="yearLevel">Year Level *</label>
              <select 
                id="yearLevel" 
                className="select" 
                value={yearLevel} 
                onChange={(e) => setYearLevel(e.target.value)}
              >
                <option>Choose 1</option>
                {/* Add more options here if needed */}
              </select>
            </div>
            <div className="formGroup">
              <FormInput 
                label="Specialization" 
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                id="specialization" 
                placeholder="Enter your specialization" 
                ariaLabel="Enter your specialization"
              />
            </div>
          </FormRow>
          <button type="button" className="secondaryButton" onClick={handleNotStudentClick}>I am not a student</button>
          <button type="submit" className="submitButton">Next</button>
        </form>
      </main>
    );
}

export default StudentRegistration;
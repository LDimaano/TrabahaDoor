import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

// TopNav Component
function TopNav() {
  return (
    <nav className="navbar navbar-light bg-light mb-4">
      <a className="navbar-brand" href="/">TrabahaDoor</a>
      <div className="d-flex">
        <a className="btn btn-secondary me-2" href="/">Back to homepage</a>
        <img src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`} alt="TrabahaDoor logo" className="d-inline-block align-top" style={{ height: '40px' }} />
      </div>
    </nav>
  );
}

// PostJobHeader Component
function PostJobHeader() {
  const navigate = useNavigate();

  // Function to handle the back button click
  const handleBack = () => {
    navigate(-1); // Navigate back
  };

  return (
    <section className="d-flex align-items-center mb-4">
      <button className="btn btn-outline-secondary me-3" onClick={handleBack} aria-label="Go back">
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <h2 className="h4">Post a Job</h2>
    </section>
  );
}

// FormSection Component
const FormSection = ({ title, description, children }) => (
  <section className="mb-4">
    <h3 className="h5">{title}</h3>
    <p>{description}</p>
    <div>{children}</div>
  </section>
);

// InputField Component
const InputField = ({ label, placeholder, value, onChange }) => (
  <div className="mb-3">
    <label htmlFor={label.toLowerCase()} className="form-label">
      {label}
    </label>
    <input
      type="text"
      id={label.toLowerCase()}
      className="form-control"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

// CheckboxGroup Component
const CheckboxGroup = ({ label, options, name, onChange }) => (
  <div className="mb-3">
    <label className="form-label">{label}</label>
    {options.map((option, index) => (
      <div key={index} className="form-check">
        <input
          type="checkbox"
          id={option.toLowerCase()}
          value={option}
          name={name}
          className="form-check-input"
          onChange={onChange}
        />
        <label htmlFor={option.toLowerCase()} className="form-check-label">
          {option}
        </label>
      </div>
    ))}
  </div>
);

// SalaryRange Component
const SalaryRange = () => (
  <div className="mb-3">
    <label htmlFor="salary" className="form-label">Salary Range</label>
    <select id="salary" className="form-select">
      <option value="below-15000">Below ₱15,000</option>
      <option value="15000-25000">₱15,000 - ₱25,000</option>
      <option value="25001-35000">₱25,001 - ₱35,000</option>
      <option value="35001-50000">₱35,001 - ₱50,000</option>
      <option value="50001-75000">₱50,001 - ₱75,000</option>
      <option value="75001-100000">₱75,001 - ₱100,000</option>
      <option value="above-100000">Above ₱100,000</option>
    </select>
  </div>
);

// Dropdown Component
const Dropdown = ({ placeholder }) => (
  <div className="mb-3">
    <label htmlFor="industry" className="form-label">Industry</label>
    <select id="industry" className="form-select">
      <option value="">{placeholder}</option>
    </select>
  </div>
);

// SkillTags Component
const SkillTags = ({ placeholder }) => (
  <div className="mb-3">
    <label htmlFor="skills" className="form-label">Skills</label>
    <select id="skills" className="form-select">
      <option value="">{placeholder}</option>
    </select>
  </div>
);

// TextAreaField Component
const TextAreaField = ({ label, description, placeholder, value, onChange }) => (
  <div className="mb-4">
    <div className="mb-2">
      <label htmlFor={`${label.toLowerCase()}Input`} className="form-label">{label}</label>
      <p>{description}</p>
    </div>
    <textarea
      id={`${label.toLowerCase()}Input`}
      className="form-control"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows="4"
    />
  </div>
);

// JobPosting Component
const JobPosting = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobType: [],
    salaryRange: '',
    industry: '',
    skills: '',
    responsibilities: '',
    jobDescription: '',
    qualifications: ''
  });
  
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { id, value, checked, type, name } = e.target;
    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked
          ? [...prevData[name], value]
          : prevData[name].filter((item) => item !== value),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/job-posting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Job posting created successfully:', data);
      
      // Navigate to next step or page
      navigate('/next-step');
    } catch (err) {
      console.error('Submission failed:', err);
      setError('Failed to submit the job posting. Please try again.');
    }
  };

  return (
    <div className="container mt-4">
      <TopNav />
      <PostJobHeader />
      
      <form onSubmit={handleSubmit}>
        <FormSection
          title="Job Information"
          description="Fill in the details for the job posting."
        >
          <InputField
            label="Job Title"
            placeholder="Enter the job title"
            value={formData.jobTitle}
            onChange={handleChange}
          />
          <Dropdown placeholder="Select Industry" />
          <SkillTags placeholder="Select Skills" />
          <SalaryRange />
        </FormSection>

        <FormSection
          title="Job Type"
          description="Select the type of job."
        >
          <CheckboxGroup
            label="Job Type"
            options={['Full-time', 'Part-time', 'Contract', 'Internship']}
            name="jobType"
            onChange={handleChange}
          />
        </FormSection>

        <FormSection
          title="Responsibilities"
          description="List the responsibilities for this role."
        >
          <TextAreaField
            label="Responsibilities"
            placeholder="Enter the responsibilities"
            value={formData.responsibilities}
            onChange={handleChange}
          />
        </FormSection>

        <FormSection
          title="Job Description"
          description="Provide a detailed description of the job."
        >
          <TextAreaField
            label="Job Description"
            placeholder="Enter the job description"
            value={formData.jobDescription}
            onChange={handleChange}
          />
        </FormSection>

        <FormSection
          title="Qualifications"
          description="List the qualifications required for this role."
        >
          <TextAreaField
            label="Qualifications"
            placeholder="Enter the qualifications"
            value={formData.qualifications}
            onChange={handleChange}
          />
        </FormSection>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary">Post Job</button>
      </form>
    </div>
  );
};

export default JobPosting;

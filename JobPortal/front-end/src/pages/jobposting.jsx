import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import EmpHeader from '../components/emp_header'; // Import the EmpHeader component
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const JobPosting = () => {
  const [responsibilities, setResponsibilities] = useState("");
  const [jobDescription, setJobDescription] = useState(""); // Updated from requirements
  const [qualifications, setQualifications] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [industry, setIndustry] = useState(""); // Updated from location
  const [salaryRange, setSalaryRange] = useState("");
  const [skills, setSkills] = useState("");
  const [jobType, setJobType] = useState(""); // New state for job type
  
  const navigate = useNavigate();

  // Function to handle the back button click
  const handleBack = () => {
    navigate(-1); // Navigate back
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Attempt to retrieve user_id from session storage
    const user_id = sessionStorage.getItem('user_id')
  
    // Log the user_id value for debugging purposes
    console.log('Retrieved user_id:', user_id);
  
    // Check if user_id is null or undefined
    if (!user_id) {
      alert('User ID not found. Please log in again.');
      return; // Exit the function if user_id is not found
    }
  
    // Construct the jobData object with user_id and other form fields
    const jobData = {
      user_id: user_id,
      JobTitle: jobTitle,
      Industry: industry,
      SalaryRange: salaryRange,
      Skills: skills,
      Responsibilities: responsibilities,
      JobDescription: jobDescription, // Updated from requirements
      Qualifications: qualifications,
      JobType: jobType // New field
    };
  
    try {
      // Send a POST request to the server with jobData
      const response = await fetch('http://localhost:5000/api/joblistings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
  
      // Check if the response is successful
      if (response.ok) {
        alert('Job posted successfully!');
        navigate('/applicantlist'); // Navigate to another page upon success
      } else {
        // Handle server response errors
        alert('Failed to post job. Please try again.');
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error posting job:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container mt-4"> {/* Added margin top here */}
      {/* Top Navigation */}
      <EmpHeader /> {/* Use EmpHeader component */}

      {/* Post Job Header */}
      <section className="d-flex align-items-center mb-4">
        <button className="btn btn-outline-secondary me-3" onClick={handleBack} aria-label="Go back" style={{ border: 'none', color: 'black' }}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h2 className="h4">Post a Job</h2>
      </section>

      {/* Job Posting Form */}
      <form className="p-4" onSubmit={handleSubmit}>
        <section className="mb-4">
          <h3 className="h5">Job Information</h3>
          <p>Provide details about the job title, industry, and location.</p>
          <div className="mb-3">
            <label htmlFor="jobTitle" className="form-label">Job Title</label>
            <input
              type="text"
              id="jobTitle"
              className="form-control"
              placeholder="Enter job title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="industry" className="form-label">Industry</label>
            <input
              type="text"
              id="industry"
              className="form-control"
              placeholder="Enter industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="salaryRange" className="form-label">Salary Range</label>
            <select
              id="salaryRange"
              className="form-control"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
            >
              <option value="" disabled>Select salary range</option>
              <option value="Below 15000">Below 15000</option>
              <option value="15001-25000">15001-25000</option>
              <option value="25001-35000">25001-35000</option>
              <option value="35001-50000">35001-50000</option>
              <option value="50001-75000">50001-75000</option>
              <option value="75001-100000">75001-100000</option>
              <option value="Above 100000">Above 100000</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="skills" className="form-label">Skills</label>
            <input
              type="text"
              id="skills"
              className="form-control"
              placeholder="Enter required skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="jobType" className="form-label">Job Type</label>
            <select
              id="jobType"
              className="form-select"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              <option value="" disabled>Select job type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Work from Home">Work from Home</option>
            </select>
          </div>
        </section>

        <section className="mb-4">
          <h3 className="h5">Job Description</h3>
          <p>Provide details about the job responsibilities and requirements.</p>
          <div className="mb-2">
            <label htmlFor="responsibilities" className="form-label">Responsibilities</label>
            <p>List the primary responsibilities for this job.</p>
          </div>
          <textarea
            id="responsibilities"
            className="form-control"
            placeholder="Describe the tasks and responsibilities associated with this job."
            rows="4"
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
          />
          <div className="d-flex justify-content-end">
            <span className="text-muted">{responsibilities.length}/3000</span>
          </div>
          <div className="mb-4">
            <div className="mb-2">
              <label htmlFor="jobDescription" className="form-label">Job Description</label>
              <p>Provide a detailed description of the job.</p>
            </div>
            <textarea
              id="jobDescription"
              className="form-control"
              placeholder="Describe the job responsibilities and requirements."
              rows="4"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <div className="d-flex justify-content-end">
              <span className="text-muted">{jobDescription.length}/3000</span>
            </div>
          </div>
          <div className="mb-4">
            <div className="mb-2">
              <label htmlFor="qualifications" className="form-label">Qualifications</label>
              <p>List the qualifications and skills required for this job.</p>
            </div>
            <textarea
              id="qualifications"
              className="form-control"
              placeholder="Describe the skills and qualifications necessary for this role."
              rows="4"
              value={qualifications}
              onChange={(e) => setQualifications(e.target.value)}
            />
            <div className="d-flex justify-content-end">
              <span className="text-muted">{qualifications.length}/3000</span>
            </div>
          </div>
        </section>

        <button type="submit" className="btn btn-primary mt-3">Post Job</button>
      </form>
    </div>
  );
};

export default JobPosting;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
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

    const jobData = {
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
      const response = await fetch('http://localhost:5000/api/joblistings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      if (response.ok) {
        alert('Job posted successfully!');
        // Optionally, redirect or clear the form
        navigate('/');
      } else {
        alert('Failed to post job. Please try again.');
      }
    } catch (error) {
      console.error('Error posting job:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container">
      {/* Top Navigation */}
      <header className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <div className="d-flex align-items-center">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/1d41edab7dfd7b603d5a4ad1ca09c3c8f114a2c36e787393ece6fc0064e84327?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
            alt="Company logo"
            className="me-3"
            style={{ maxWidth: '50px' }}
          />
          <div>
            <p className="mb-0 fw-bold">Company</p>
            <h1 className="mb-0 d-flex align-items-center">
              Saint Anthony Montessori
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/094d56e22dd1b07143c6e0b7804b4e8167234f7715ffe38b80659cd99184a939?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
                alt="Verified badge"
                className="ms-2"
                style={{ maxWidth: '30px' }}
              />
            </h1>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/6dac324345bbc13698ac872cc77d9d263753bd48e8f7f2cbe129c409887b48dc?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
            alt="User profile"
            className="me-3"
            style={{ maxWidth: '40px', borderRadius: '50%' }}
          />
          <button className="btn btn-primary d-flex align-items-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/2e7d66b5d85410abffc25e2d6f30311bb55cb26c3092bd566c5f85092b3362d6?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
              alt="Post job icon"
              className="me-2"
              style={{ maxWidth: '20px' }}
            />
            <span>Post a job</span>
          </button>
        </div>
      </header>

      {/* Post Job Header */}
      <section className="d-flex align-items-center mb-4">
        <button className="btn btn-outline-secondary me-3" onClick={handleBack} aria-label="Go back">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h2 className="h4">Post a Job</h2>
      </section>

      {/* Job Posting Stepper */}
      <nav className="d-flex justify-content-between my-4">
        {[{
          imgSrc: 'https://cdn.builder.io/api/v1/image/assets/TEMP/6a42fd1310401124f065989747c4a4f9f75a4e05167b241e82d076d6bb0a9963?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975',
          title: 'Job Information',
          isActive: true,
        }, {
          imgSrc: 'https://cdn.builder.io/api/v1/image/assets/TEMP/46c54760f1a99081a79cc0bf9bcef9fc0e5a10546bbbac656e7081a2d3814873?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975',
          title: 'Job Description',
          isActive: false,
        }].map((step, index) => (
          <React.Fragment key={index}>
            <div className={`d-flex align-items-center ${step.isActive ? 'text-primary' : ''}`}>
              <img loading="lazy" src={step.imgSrc} alt={`Step ${index + 1} icon`} className="me-2" style={{ maxWidth: '30px' }} />
              <div>
                <div className="fw-bold">Step {index + 1}</div>
                <div>{step.title}</div>
              </div>
            </div>
            {index < 1 && <div className="mx-2 border-end" style={{ height: '2rem' }} />}
          </React.Fragment>
        ))}
      </nav>

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

        <button type="submit" className="btn btn-primary">Post Job</button>
      </form>
    </div>
  );
};

export default JobPosting;

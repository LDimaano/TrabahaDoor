import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Range } from 'react-range';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import EmpHeader from '../../components/emp_header'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Select from 'react-select'; 
import { Modal, Button, Alert } from 'react-bootstrap';

const JobPosting = () => {
  const [responsibilities, setResponsibilities] = useState("");
  const [jobDescription, setJobDescription] = useState(""); 
  const [qualifications, setQualifications] = useState("");
  const [positions, setPositions] = useState(1);
  const [jobTitle, setJobTitle] = useState(null); 
  const [industry, setIndustry] = useState(null);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [salaryRange, setSalaryRange] = useState("");
  const [skills, setSkills] = useState([]); 
  const [availableSkills, setAvailableSkills] = useState([]);
  const [availableJobTitles, setAvailableJobTitles] = useState([]); 
  const [jobType, setJobType] = useState("");
  const [error, setError] = useState(''); 
  const [showModal, setShowModal] = useState(false); 
  const [successMessage, setSuccessMessage] = useState(''); 
  const [education, setEducation] = useState('');
  const [educationOptions, setEducationOptions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/skills`);
        if (!response.ok) throw new Error('Failed to fetch skills');
        const data = await response.json();
        const skillOptions = data.map(skill => ({
          value: skill.skill_id,
          label: skill.skill_name
        }));
        setAvailableSkills(skillOptions);
      } catch (error) {
        console.error('Error fetching skills:', error);
        setError('Failed to load skills.');
      }
    };

    const fetchJobTitles = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobtitles`); 
        if (!response.ok) throw new Error('Failed to fetch job titles');
        const data = await response.json();
        const jobTitleOptions = data.map(jobTitle => ({
          value: jobTitle.jobtitle_id, 
          label: jobTitle.job_title 
        }));
        setAvailableJobTitles(jobTitleOptions);
      } catch (error) {
        console.error('Error fetching job titles:', error);
        setError('Failed to load job titles.');
      }
    };

    const fetchIndustries = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/industries`);
        if (!response.ok) throw new Error('Failed to fetch industries');
        const data = await response.json();
        const industryOptions = data.map(industry => ({
          value: industry.industry_id,
          label: industry.industry_name,
        }));
        setIndustryOptions(industryOptions);
      } catch (error) {
        console.error('Error fetching industries:', error);
        setError('Failed to load industries.');
      }
    };
      const fetchEducationOptions = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/educations`); 
          if (!response.ok) throw new Error('Failed to fetch industries');
          const data = await response.json();
          const educationOptions = data.map(education => ({
            value: education.education_id,
            label: education.education_name
          }));
          setEducationOptions(educationOptions); 
        } catch (error) {
          console.error('Error fetching education options:', error);
        }
      };


    fetchEducationOptions();
    fetchSkills();
    fetchJobTitles();
    fetchIndustries();
  }, []);

  const handleSkillChange = (index, selectedOption) => {
    const newSkills = [...skills];
    newSkills[index] = selectedOption; 
    setSkills(newSkills);
  };

  const handleAddSkill = () => {
    setSkills([...skills, null]); 
  };

  const handleRemoveSkill = (index) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
  };

  const handleJobTitleChange = (selectedOption) => {
    setJobTitle(selectedOption); 
  };

  const handleEducationChange = (index, selectedOption) => {
    const newEducation = [...education];
    newEducation[index] = selectedOption;
    setEducation(newEducation);
  };
  
  // Add a new education field
  const handleAddEducation = () => {
    setEducation([...education, null]);
  };
  
  // Remove an education field
  const handleRemoveEducation = (index) => {
    const newEducation = education.filter((_, i) => i !== index);
    setEducation(newEducation);
  };

  const handleBack = () => {
    navigate(-1); 
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    const user_id = sessionStorage.getItem('user_id');
    
    if (!user_id) {
      alert('User ID not found. Please log in again.');
      return; 
    }
    
    const jobData = {
      user_id: user_id,
      jobtitle_id: jobTitle?.value || '', 
      industry_id: industry?.value || '',
      SalaryRange: salaryRange,
      education: education.map(education => education?.value || ''),
      skills: skills.map(skill => skill?.value || ''),
      Responsibilities: responsibilities,
      JobDescription: jobDescription, 
      Qualifications: qualifications,
      JobType: jobType,
      positions: positions 
    };
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobs/joblistings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
      
      if (response.ok) {
        setSuccessMessage('Job posted successfully!'); 
        setTimeout(() => {
          setSuccessMessage(''); 
          navigate('/applicant_joblisting'); 
        }, 3000); 
      } else {
        alert('Failed to post job. Please try again.');
      }
    } catch (error) {
      console.error('Error posting job:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // Function to handle modal confirmation
  const handleConfirmPost = (e) => {
    e.preventDefault();  
    setShowModal(true);  
  };

  const handleModalClose = () => {
    setShowModal(false); 
  };

  const handleModalConfirm = () => {
    handleSubmit();  
    setShowModal(false);
  };

  return (
    <div className="container mt-4"> 
      <EmpHeader /> 
      <section className="d-flex align-items-center mb-4">
        <button className="btn btn-outline-secondary me-3" onClick={handleBack} aria-label="Go back" style={{ border: 'none', color: 'black' }}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h2 className="h4">Post a Job</h2>
      </section>

      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
          {successMessage}
        </Alert>
      )}

      <form className="p-4" onSubmit={handleSubmit}>
        <section className="mb-4">
          <h3 className="h5">Job Information</h3>
          <p>Provide details about the job title, industry, and location.</p>
          <div className="mb-3">
            <label htmlFor="jobTitle" className="form-label">Job Title</label>
            <Select
              id="jobTitle"
              value={jobTitle}
              options={availableJobTitles}
              onChange={handleJobTitleChange}
              placeholder="Select a job title"
            />
          </div>
          <div className="mb-3">
          <label htmlFor="industry" className="form-label">Industry *</label>
          <Select
            id="industry"
            options={industryOptions}
            value={industry}
            onChange={setIndustry}
            placeholder="Select Industry"
            isClearable
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor={`salaryRange-0`} className="form-label fw-bold d-block mb-2">
            Salary Range (in ₱)
          </label>
          <div
            className="slider-container"
            style={{
              display: "flex", // Align items inline
              alignItems: "center", // Vertical alignment of items
              gap: "8px", // Spacing between elements
            }}
          >
            {/* Minimum Label */}
            <small
              style={{
                fontSize: "0.9rem", // Smaller text for label
                color: "#6c757d", // Bootstrap muted color
                marginRight: "8px", // Space after minimum label
              }}
            >
              ₱5,000
            </small>

            {/* Slider */}
            <Range
              step={1000}
              min={5000}
              max={100000}
              values={
                salaryRange
                  ? salaryRange.split("-").map((val) => parseInt(val))
                  : [5000, 10000]
              }
              onChange={(values) => setSalaryRange(`${values[0]}-${values[1]}`)} // Store range as '5000-10000'
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "6px",
                    width: "100%",
                    backgroundColor: "#ddd",
                  }}
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "16px",
                    width: "16px",
                    backgroundColor: "#007bff",
                    borderRadius: "50%",
                  }}
                />
              )}
            />
            {/* Current Value Label */}
            <small
              style={{
                fontSize: "0.9rem",
                color: "#6c757d",
                margin: "0 8px", // Space on both sides
              }}
            >
              {salaryRange
                ? `₱${salaryRange.replace("-", " to ₱")}`
                : "₱5,000-₱10,000"}
            </small>

            {/* Maximum Label */}
            <small
              style={{
                fontSize: "0.9rem",
                color: "#6c757d",
                marginLeft: "8px", // Space before maximum label
              }}
            >
              ₱100,000
            </small>
          </div>
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
          <div className="mb-3">
          <label htmlFor="jobType" className="form-label">Positions</label>
          <input
            type="number"
            id="positions"
            className="form-control"
            value={positions}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10) || 0; 
              console.log("Positions input value:", value); 
              setPositions(value);
            }}
            min="0"
            step="1"
          />
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
              placeholder="Describe the role, objectives, and company culture."
              rows="4"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <div className="d-flex justify-content-end">
              <span className="text-muted">{jobDescription.length}/3000</span>
            </div>
          </div>
        </section>


      <section className="mb-4">
      <h3 className="h5">Qualifications</h3>
      <p>List the qualifications and requirements for this job.</p>

          <p>Select the education levels or courses required for this job.</p>
      {education.map((edu, index) => (
        <div className="mb-3" key={index}>
          <div className="d-flex">
            <Select
              id={`education_${index}`}
              value={edu}
              options={educationOptions}
              onChange={(selectedOption) => handleEducationChange(index, selectedOption)}
              placeholder="Select an education level or course"
              className="flex-grow-1 me-2"
            />
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => handleRemoveEducation(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={handleAddEducation}
      >
        Add Education
      </button>


      {/* Textarea for Qualifications */}
      <textarea
        id="qualifications"
        className="form-control"
        placeholder="Describe the education, experience, and skills required for this position."
        rows="4"
        value={qualifications}
        onChange={(e) => setQualifications(e.target.value)}
      />
    </section>

        <section className="mb-4">
          <h3 className="h5">Required Skills</h3>
          <p>Select the skills required for this job.</p>
          {skills.map((skill, index) => (
            <div className="mb-3" key={index}>
              <div className="d-flex">
                <Select
                  id={`skill_${index}`}
                  value={skill}
                  options={availableSkills}
                  onChange={(selectedOption) => handleSkillChange(index, selectedOption)}
                  placeholder="Select a skill"
                  className="flex-grow-1 me-2"
                />
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => handleRemoveSkill(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={handleAddSkill}
          >
            Add Skill
          </button>
        </section>


        <div className="d-flex justify-content-end">
  <button type="button" className="btn btn-primary" onClick={handleConfirmPost}>
    Post Job
  </button>
</div>
</form>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Job Posting</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to post this job?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleModalConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default JobPosting;

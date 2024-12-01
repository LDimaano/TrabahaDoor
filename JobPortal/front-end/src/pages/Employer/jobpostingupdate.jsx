import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Range } from 'react-range';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import EmpHeader from '../../components/emp_header';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import { Modal, Button } from 'react-bootstrap';

const UpdateJobPosting = () => {
  const { job_id } = useParams(); 
  const [responsibilities, setResponsibilities] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [jobTitle, setJobTitle] = useState(null);
  const [industry, setIndustry] = useState(null);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [salaryRange, setSalaryRange] = useState("");
  const [skills, setSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [availableJobTitles, setAvailableJobTitles] = useState([]);
  const [jobType, setJobType] = useState("");
  const [positions, setPositions] = useState(1);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [education, setEducation] = useState([]);
  const [educationOptions, setEducationOptions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobs/fetch-jobinfo/${job_id}`); 
        if (!response.ok) throw new Error('Failed to fetch job data');
        const data = await response.json();

        setResponsibilities(data.JobDescription.responsibilities || "");
        setJobDescription(data.JobDescription.description || "");
        setQualifications(data.JobDescription.qualifications || "");
        setJobTitle({
          value: data.JobDescription.jobtitle_id,
          label: data.JobDescription.jobtitle_name
        });
        setIndustry({
          value: data.JobDescription.industry_id,
          label: data.JobDescription.industry_name
        });
        setSalaryRange(data.JobDescription.salary || "");
        setJobType(data.JobDescription.jobtype || "");
        setPositions(data.JobDescription.positions || "");

        const skillsArray = data.JobDescription.skills.map(skill => ({
          value: skill.skillId, 
          label: skill.skillName 
        })) || [];
        
        setSkills(skillsArray);

        console.log(setSkills)

        const educationArray = data.JobDescription.educations.map(educations => ({
          value: educations.educationId, 
          label: educations.educationName 
        })) || [];
        
        setEducation(educationArray);

        console.log(setEducation)

      } catch (error) {
        console.error('Error fetching job data:', error);
        setError('Failed to load job data.');
      }
    };

    fetchJobData();

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

  }, [job_id]);

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

  const handleAddEducation = () => {
    setEducation([...education, null]);
  };
  
  const handleRemoveEducation = (index) => {
    const newEducation = education.filter((_, i) => i !== index);
    setEducation(newEducation);
  };

  const handleBack = () => {
    navigate(-1);
  };


  const handleUpdate = async () => {
    const user_id = sessionStorage.getItem('user_id');
    console.log('Retrieved user_id:', user_id);
    const jobData = {
      user_id,
      jobtitle_id: jobTitle?.value || '',
      industry_id: industry?.value || '',
      SalaryRange: salaryRange,
      skills: skills.map(skill => skill?.value || ''),
      Responsibilities: responsibilities,
      JobDescription: jobDescription,
      Qualifications: qualifications,
      JobType: jobType,
      Positions: positions
    };

    try {
      // Send a PUT request to the server with jobData
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobs/updatejoblistings/${job_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      if (response.ok) {
        alert('Job updated successfully!');
        navigate('/applicant_joblisting');
      } else {
        alert('Failed to update job. Please try again.');
      }
    } catch (error) {
      console.error('Error updating job:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleConfirmUpdate = (e) => {
    e.preventDefault();  
    setShowModal(true);  
  };

  const handleModalClose = () => {
    setShowModal(false); 
  };

  const handleModalConfirm = () => {
    handleUpdate();
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <EmpHeader />

      <section className="d-flex align-items-center mb-4">
        <button className="btn btn-outline-secondary me-3" onClick={handleBack} aria-label="Go back" style={{ border: 'none', color: 'black' }}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h2 className="h4">Update Job</h2>
      </section>

      <form className="p-4" onSubmit={handleConfirmUpdate}>
        <section className="mb-4">
          <h3 className="h5">Job Information</h3>
          <p>Update details about the job title, industry, and location.</p>
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
            <label htmlFor={`salaryRange`} className="form-label">Salary Range (in ₱)</label>
            
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
                values={salaryRange
                  ? salaryRange.split("-").map((val) => parseInt(val))  // Split the string and convert to integers
                  : [5000, 10000] // Default value if salaryRange is undefined
                }
                onChange={(values) => setSalaryRange(`${values[0]}-${values[1]}`)} // Handle slider change
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
                {salaryRange ? `₱${salaryRange.replace("-", " to ₱")}` : "₱5,000-₱10,000"}
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
              setPositions(parseInt(e.target.value, 10) || 0); 
            }}
          />
        </div>
        </section>
        <section className="mb-4">
          <h3 className="h5">Job Description</h3>
          <p>Update details about the job responsibilities and requirements.</p>
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
          <p>Update the qualifications and requirements for this job.</p>
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
          <button type="button" className="btn btn-primary" onClick={handleConfirmUpdate}>
            Update Job
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Job Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to update this job?</Modal.Body>
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

export default UpdateJobPosting;

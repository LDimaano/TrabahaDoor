import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Range } from 'react-range';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import { ProgressBar } from 'react-bootstrap';
import { Modal, Button } from 'react-bootstrap';
import TermsAndConditions from '../../components/termsandconditions';
import Header from '../../components/header_unverified1';


function ProfileCreation() {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState(null);
  const [addressOptions, setAddressOptions] = useState([]);
  const [industry, setIndustry] = useState(null);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [experience, setExperience] = useState([
    {
      jobTitle: null,
      salaryRange: "5000-10000", 
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
    },
  ]);  
  const [skills, setSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [availableJobTitles, setAvailableJobTitles] = useState([]);
  const [education, setEducation] = useState([]);
  const [educationOptions, setEducationOptions] = useState([]);
  const [error, setError] = useState('');
  const [photo, setPhoto] = useState(null);

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

  const handleExperienceChange = (index, event) => {
    const { name, value } = event.target;
    const newExperience = [...experience];
    newExperience[index] = { ...newExperience[index], [name]: value };
    setExperience(newExperience);
  };

  const handleExperienceJobTitleChange = (index, selectedOption) => {
    const newExperience = [...experience];
    newExperience[index] = { ...newExperience[index], jobTitle: selectedOption };
    setExperience(newExperience);
  };


  const handleSalaryChange = (values, index) => {
    const newExperience = [...experience]; 
    newExperience[index].salaryRange = `${values[0]}-${values[1]}`; 
    setExperience(newExperience); 
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
  
  
  const handleAddExperience = () => {
    setExperience([
      ...experience,
      {
        jobTitle: null,
        salaryRange: '5000-10000', 
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
      }
    ]);
  };
  
  const handleRemoveExperience = (index) => {
    const newExperience = experience.filter((_, i) => i !== index);
    setExperience(newExperience);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    
    const userId = window.location.pathname.split('/')[2];
    
    const defaultProfilePictureUrl = "https://trabahadoor-bucket.s3.amazonaws.com/jobseeker.png";

    setError(''); // Clear any previous error messages
    
    if (!file) {
        console.log('No file selected, using default profile picture');
        setPhoto(defaultProfilePictureUrl); 
        return;
    }
    
    // Validate file type
    const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validFileTypes.includes(file.type)) {
        console.error('Invalid file type. Only JPEG, JPG, and PNG are allowed.');
        return;
    }
    
    // Validate file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
        console.error('File size exceeds 5MB. Please select a smaller file.');
        return;
    }
    
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    try {
        console.log('Uploading file...', file);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/upload-profile-picture/${userId}`, {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Uploaded image data:', data);
        setPhoto(data.profilePictureUrl); 
    } catch (error) {
        console.error('Error uploading profile picture:', error);
    }
};

const calculateProgress = () => {
  let progress = 0;
  const totalFields = 8 + experience.length + skills.length; 

  if (fullName) progress += 1;
  if (phoneNumber) progress += 1;
  if (dateOfBirth) progress += 1;
  if (gender) progress += 1;
  if (address) progress += 1;
  if (industry) progress += 1;
  if (photo) progress += 1; 
  

  skills.forEach((skill) => {
    if (skill) progress += 1; // Increment if a skill is selected
  });

  // Experience completion (each experience section counts as 1 field)
  experience.forEach((exp) => {
    if (exp.jobTitle && exp.salaryRange && exp.company) progress += 1; // Ensure certain fields are completed
  });

  // Calculate and return the percentage
  return Math.floor((progress / totalFields) * 100); 
};

  // State for controlling the modal visibility
const [showModal, setShowModal] = useState(false);

// Function to handle modal submit
const handleModalSubmit = () => {
  if (!isChecked) {
    setError("You must agree to the terms and conditions before submitting.");
    return;
  }

  setShowModal(false); // Close modal
  handleSubmit(); // Call the original submit function
};

const handleCheckboxChange = (e) => {
  setIsChecked(e.target.checked);
};


// Function to handle modal cancel
const handleModalCancel = () => {
  setShowModal(false); // Close modal
};


  // Modify your existing form's onSubmit to show the modal first
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowModal(true); // Show confirmation modal
};

const handleSubmit = async (e) => {
  if (e) e.preventDefault(); // Prevent default form submission behavior

  // Ensure user ID is available
  const user_id = window.location.pathname.split('/')[2];

  // Prepare the profile data, ensuring a fallback for photo
  const profileData = {
    user_id,
    fullName,
    phoneNumber,
    dateOfBirth,
    gender,
    address_id: address?.value || '',
    industry_id: industry?.value || '',
    educations: education.map(education => education?.value || ''),
    skills: skills.map(skill => skill?.value || ''),
    experience: experience.map(exp => ({
      jobTitle: exp.jobTitle?.value || '',
      salary: exp.salaryRange, 
      company: exp.company,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description,
    })),
    profile_picture_url: photo, 
  };

  console.log('Profile data to submit:', profileData);

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobseekers/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseBody = await response.json();
    console.log('Profile created successfully:', responseBody);

    // Navigate to login after success
    setTimeout(() => {
      navigate('/home_jobseeker');
    }, 500);
  } catch (err) {
    console.error('Submission failed:', err);
    setError('Failed to submit the profile. Please try again.');
  }
};


  
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/skills`);
        if (!response.ok) throw new Error('Failed to fetch skills');
        const data = await response.json();
        const skillOptions = data.map(skill => ({
          value: skill.skill_id,
          label: skill.skill_name,
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
          label: jobTitle.job_title,
        }));
        setAvailableJobTitles(jobTitleOptions);
      } catch (error) {
        console.error('Error fetching job titles:', error);
        setError('Failed to load job titles.');
      }
    };

    const fetchAddresses = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/addresses`);
        if (!response.ok) throw new Error('Failed to fetch addresses');
        const data = await response.json();
        const addressOptions = data.map(address => ({
          value: address.address_id,
          label: address.location,
        }));
        setAddressOptions(addressOptions);
      } catch (error) {
        console.error('Error fetching addresses:', error);
        setError('Failed to load addresses.');
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
    fetchAddresses();
    fetchIndustries();
  }, []);

  return (
    <div className="container mt-4">
    <Header style={{ fontSize: '3rem', fontWeight: 'bold' }} /> {/* Increased header size */}
    
    {/* Text Section */}
    <div className="text-center"> {/* Centers the content */}
  <h4>Create your Profile</h4> {/* Reduced font size */}
  <h5 className="text-muted">Let us know more about you</h5>
</div>

  
    {/* Progress Bar Section */}
    <div 
      className="mb-4 mt-5 sticky-top bg-white p-2" 
      style={{ zIndex: '1000', top: '0' }} 
    > {/* Sticky with padding and background */}
      {/* Title or Label for the Progress */}
      <h5 className="text-start text-muted">Sign-Up Progress</h5> {/* Left-align the text */}
      <p className="text-start text-muted">Fill out the information below to complete your profile.</p> {/* Left-align the description */}
      
      {/* Progress Bar */}
      <ProgressBar
        now={calculateProgress()} // Dynamically calculate progress
        label={`${calculateProgress()}%`}
        className="mb-4"
        variant="info" // You can change this variant for different colors
        style={{ height: '20px', borderRadius: '10px' }} // Custom height and rounded corners
      />
    </div>
  

      <form onSubmit={handleSubmit}>
      <div className="mb-4 border p-4">
  <h3>Profile Photo</h3>
  <div className="mb-3">
    <label htmlFor="photo" className="form-label">Upload your profile photo</label>
    <input
      type="file"
      className="form-control"
      id="photo"
      accept="image/*"
      onChange={handleFileChange}
    />
    {error && <div className="text-danger mt-2">{error}</div>}
    <small className="form-text text-muted">
      Accepted file types: JPEG, JPG, PNG. Maximum file size: 5MB.
    </small>
    <p className="text-info text-muted">
      A professional profile photo helps make a great first impression on potential employers and can increase your chances of landing the right opportunity!
    </p>
  </div>
</div>

        <div className="mb-4 border p-4">
          <h3>Personal Details</h3>
          <div className="mb-3 position-relative">
  <label htmlFor="fullName" className="form-label">
    Full Name *{' '}
    <i
      className="far fa-question-circle" // Use "far" for a hollow circle
      data-bs-toggle="tooltip"
      data-bs-placement="right"
      title="Enter your full name as it appears on official documents. Example: Juan Dela Cruz"
      style={{ cursor: 'pointer' }}
    ></i>
  </label>
  <input
    type="text"
    className="form-control"
    id="fullName"
    value={fullName}
    onChange={(e) => setFullName(e.target.value)}
    required
  />
</div>

<div className="row mb-3">
  <div className="col-md-6">
    <label htmlFor="phoneNumber" className="form-label">
      Phone Number *{' '}
      <i
        className="far fa-question-circle" // Hollow question mark icon
        data-bs-toggle="tooltip"
        data-bs-placement="right"
        title="Enter a valid phone number, including the country code if applicable. Example: +63 234 567 8900. This will not be shared publicly "
        style={{ cursor: 'pointer' }}
      ></i>
    </label>
    <input
      type="tel"
      className="form-control"
      id="phoneNumber"
      value={phoneNumber}
      onChange={(e) => setPhoneNumber(e.target.value)}
      required
    />
  </div>
</div>

          <div className="row mb-3">
          <div className="col-md-6">
    <label htmlFor="dateOfBirth" className="form-label">
      Date of Birth *{' '}
      <i
        className="far fa-question-circle" // Hollow question mark icon
        data-bs-toggle="tooltip"
        data-bs-placement="right"
        title="Select your date of birth. Format: YYYY-MM-DD. Example: 1990-01-01"
        style={{ cursor: 'pointer' }}
      ></i>
    </label>
    <input
      type="date"
      className="form-control"
      id="dateOfBirth"
      value={dateOfBirth}
      onChange={(e) => setDateOfBirth(e.target.value)}
      required
    />
  </div>
  <div className="col-md-6">
  <label htmlFor="gender" className="form-label">
    Gender *{' '}
    <i
      className="far fa-question-circle" // Hollow question mark icon
      data-bs-toggle="tooltip"
      data-bs-placement="right"
      title="Select your gender from the available options. This information helps us personalize your profile."
      style={{ cursor: 'pointer' }}
    ></i>
  </label>
  <select
    className="form-select"
    id="gender"
    value={gender}
    onChange={(e) => setGender(e.target.value)}
    required
  >
    <option value="">Select Gender</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
  </select>
</div>

          </div>
          <div className="mb-3">
  <label htmlFor="address" className="form-label">
    Address *{' '}
    <i
      className="far fa-question-circle" // Hollow question mark icon
      data-bs-toggle="tooltip"
      data-bs-placement="right"
      title="Select your address from the available options. This information helps us verify your location."
      style={{ cursor: 'pointer' }}
    ></i>
  </label>
  <Select
    id="address"
    options={addressOptions}
    value={address}
    onChange={setAddress}
    placeholder="Select Address"
    isClearable
    required
  />
</div>

<div className="mb-3">
  <label htmlFor="industry" className="form-label">
    Industry *{' '}
    <i
      className="far fa-question-circle" // Hollow question mark icon
      data-bs-toggle="tooltip"
      data-bs-placement="right"
      title="Select your industry from the available options. This helps us match you with relevant job opportunities."
      style={{ cursor: 'pointer' }}
    ></i>
  </label>
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

<div className="mb-3">
  <label htmlFor="educationDropdown" className="form-label">
    Education Level or Course{' '}
    <i
      className="far fa-question-circle" // Hollow question mark icon
      data-bs-toggle="tooltip"
      data-bs-placement="right"
      title="Select your highest education level or relevant course. You can add multiple entries if applicable."
      style={{ cursor: 'pointer' }}
    ></i>
  </label><br />
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
</div>
</div>

        <div className="mb-4 border p-4">
          <h3>Experience</h3>
          {experience.map((exp, index) => (
            <div key={index} className="mb-3">
              <label className="form-label">Experience {index + 1}</label>
              <div className="row">
                <div className="col-md-6 mb-3">
                <label htmlFor={`jobTitle-${index}`} className="form-label">
                    Job Title
                    <span
                      className="bi bi-info-circle text-muted ms-2"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Enter the job title for the position you're hiring for"
                    ></span>
                  </label>
                  <small className="text-muted">
                    Provide the official job title for the role.
                  </small>

                  <Select
                    id={`jobTitle-${index}`}
                    options={availableJobTitles}
                    value={exp.jobTitle}
                    onChange={(selectedOption) => handleExperienceJobTitleChange(index, selectedOption)}
                    placeholder="Select Job Title"
                    isClearable
                  />
                </div>
                <div className="col-md-6 mb-3">
              <label htmlFor={`salaryRange-0`} className="form-label fw-bold d-block mb-2">
                Salary Range (in ₱)
                <i
              className="far fa-question-circle" // Hollow question mark icon
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              title="Use the slider to select your expected salary range for this position."
              style={{ cursor: 'pointer' }}
            ></i>
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
                exp.salaryRange
                  ? exp.salaryRange.split("-").map((val) => parseInt(val))
                  : [5000, 10000]
              }
              onChange={(values) => handleSalaryChange(values, index)}
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
                  {experience[index]?.salaryRange
                  ? `₱${experience[index].salaryRange.replace("-", " to ₱")}`
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
            </div>
              <div className="mb-3">
                <label htmlFor={`company-${index}`} className="form-label">Company
                <i
                className="far fa-question-circle" // Hollow question mark icon
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title="Enter the name of the company where you worked."
                style={{ cursor: 'pointer' }}
              ></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={`company-${index}`}
                  name="company"
                  value={exp.company}
                  onChange={(event) => handleExperienceChange(index, event)}
                  placeholder="Company"
                />
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor={`location-${index}`} className="form-label">Location
                  <i
                  className="far fa-question-circle" // Hollow question mark icon
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="Enter the location where your company is based or where you worked."
                  style={{ cursor: 'pointer' }}
                ></i>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id={`location-${index}`}
                    name="location"
                    value={exp.location}
                    onChange={(event) => handleExperienceChange(index, event)}
                    placeholder="Location"
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor={`startDate-${index}`} className="form-label">Start Date
                  <i
    className="far fa-question-circle" // Hollow question mark icon
    data-bs-toggle="tooltip"
    data-bs-placement="right"
    title="Select the date when you started your position at this company."
    style={{ cursor: 'pointer' }}
  ></i>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id={`startDate-${index}`}
                    name="startDate"
                    value={exp.startDate}
                    onChange={(event) => handleExperienceChange(index, event)}
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor={`endDate-${index}`} className="form-label">End Date
                  <i
    className="far fa-question-circle" // Hollow question mark icon
    data-bs-toggle="tooltip"
    data-bs-placement="right"
    title="Select the date when you ended or left your job or position. If still working, leave it empty."
    style={{ cursor: 'pointer' }}
  ></i>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id={`endDate-${index}`}
                    name="endDate"
                    value={exp.endDate}
                    onChange={(event) => handleExperienceChange(index, event)}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor={`description-${index}`} className="form-label">Description
                <i
    className="far fa-question-circle" // Hollow question mark icon
    data-bs-toggle="tooltip"
    data-bs-placement="right"
    title="Provide a brief description of your responsibilities and achievements in this role."
    style={{ cursor: 'pointer' }}
  ></i>
                </label>
                <textarea
                  className="form-control"
                  id={`description-${index}`}
                  name="description"
                  value={exp.description}
                  onChange={(event) => handleExperienceChange(index, event)}
                  placeholder="Describe your responsibilities and accomplishments"
                  rows="3"
                />
              </div>
              <button
                type="button"
                className="btn btn-danger mb-3"
                onClick={() => handleRemoveExperience(index)}
              >
                Remove Experience
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddExperience}
          >
            Add Experience
          </button>
        </div>
        <div className="mb-4 border p-4">
          <h3>Skills</h3>
          {skills.map((skill, index) => (
            <div key={index} className="mb-3">
              <label className="form-label">Skill {index + 1}
              <i
              className="far fa-question-circle" // Hollow question mark icon
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              title="Enter a skill you possess that is relevant to your job profile."
              style={{ cursor: 'pointer' }}
            ></i>
              </label>
              <div className="d-flex">
                <Select
                  options={availableSkills}
                  value={skill}
                  onChange={(selectedOption) => handleSkillChange(index, selectedOption)}
                  placeholder="Select Skill"
                  isClearable
                  styles={{
                    container: (provided) => ({
                      ...provided,
                      minWidth: "500px", 
                      width: "auto", 
                      flexGrow: 1, 
                    }),
                    menu: (provided) => ({
                      ...provided,
                      width: "auto", 
                      minWidth: "500px",
                    }),
                  }}
                />
                <button
                  type="button"
                  className="btn btn-danger ms-2"
                  onClick={() => handleRemoveSkill(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddSkill}
          >
            Add Skill
          </button>
        </div>
        {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
        <div className="text-end">
          <button
            type="submit"
            className="btn btn-success"
            onClick={handleFormSubmit}
          >
            Submit Profile
          </button>
        </div>
      </form>
      <Modal show={showModal} onHide={handleModalCancel} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Terms and Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <TermsAndConditions />
          <div className="form-check mt-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="termsCheckbox"
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label" htmlFor="termsCheckbox">
              I have read and agree to the terms and conditions.
            </label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}
          disabled={!isChecked}>
            Confirm Submission
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProfileCreation;
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import { Modal, Button } from 'react-bootstrap';

function ProfileEditForm() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState(null);
  const [address, setAddress] = useState(null);
  const [addressOptions, setAddressOptions] = useState([]);
  const [industry, setIndustry] = useState(null);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [availableJobTitles, setAvailableJobTitles] = useState([]);
  const [salaryRanges] = useState([
    { value: '', label: 'Select salary range' },
    { value: 'Below 15000', label: 'Below 15000' },
    { value: '15001-25000', label: '15001-25000' },
    { value: '25001-35000', label: '25001-35000' },
    { value: '35001-50000', label: '35001-50000' },
    { value: '50001-75000', label: '50001-75000' },
    { value: '75001-100000', label: '75001-100000' },
    { value: 'Above 100000', label: 'Above 100000' },
  ]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const options = [
    { value: '', label: 'Choose...' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

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

  const handleExperienceSalaryRangeChange = (index, selectedOption) => {
    const newExperience = [...experience];
    newExperience[index] = { ...newExperience[index], salaryRange: selectedOption };
    setExperience(newExperience);
  };

  const handleAddExperience = () => {
    setExperience([...experience, {
      jobTitle: null,
      salaryRange: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
    }]);
  };

  const handleRemoveExperience = (index) => {
    const newExperience = experience.filter((_, i) => i !== index);
    setExperience(newExperience);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowModal(true); // Show confirmation modal
  };

  const handleModalSubmit = async () => {
    setShowModal(false); // Close modal
    await handleSubmit(); // Call the original submit function
  };

  const handleModalCancel = () => {
    setShowModal(false); // Close modal
  };

  const handleSubmit = async () => {
    // Ensure user ID is available
    const user_id = userId;

    // Continue with profile data submission
    const profileData = {
      user_id,
      fullName,
      phoneNumber,
      dateOfBirth,
      gender,
      address_id: address?.value || '',
      industry_id: industry?.value || '',
      skills: skills.map(skill => skill?.value || ''),
      experience: experience.map(exp => ({
        jobTitle: exp.jobTitle?.value || '',
        salary: exp.salaryRange?.value || '',
        company: exp.company,
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.endDate,
        description: exp.description,
      })),
      profile_picture_url: '' // Remove photo handling
    };

    try {
      const response = await fetch(`http://localhost:5000/api/jobseekers/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseBody = await response.json();
      console.log('Profile updated successfully:', responseBody);

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Submission failed:', err);
      setError('Failed to submit the profile. Please try again.');
    }
  };
   // Fetch profile data when component mounts
  useEffect(() => {
    // Example of how to access experiences and skills
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/jobseekers/fetchjobseeker-profile/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch profile data');
        const data = await response.json();
    
        setFullName(data.jobSeeker.fullName || '');
        setPhoneNumber(data.jobSeeker.phoneNumber || '');
    
        // Format date properly
        const date = new Date(data.jobSeeker.dateOfBirth);
        setDateOfBirth(date.toISOString().split('T')[0]);
    
        setGender({ value: data.jobSeeker.gender, label: data.jobSeeker.gender });
        setAddress({ value: data.jobSeeker.address, label: data.jobSeeker.addressName });
        
        // Set industry
        setIndustry({ value: data.jobSeeker.industry, label: data.jobSeeker.industryName });

        setExperience(data.jobSeeker.experiences || []);

        
    
        // Set skills as an array of skill names or objects
        const skillsArray = data.jobSeeker.skills.map(skill => ({ value: skill.skillId, label: skill.skillId })) || [];
        setSkills(skillsArray);
        
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Failed to load profile data.');
      }
    };    

    const fetchSkills = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/skills');
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
        const response = await fetch('http://localhost:5000/api/jobtitles');
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
        const response = await fetch('http://localhost:5000/api/addresses');
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
        const response = await fetch('http://localhost:5000/api/industries');
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

    fetchProfileData();
    fetchSkills();
    fetchJobTitles();
    fetchAddresses();
    fetchIndustries();
  }, [userId]);

  return (
    <div className="container mt-4">
      <h1 className="text-center">Update your Profile</h1>
      <h5 className="text-center">Let us know more about you</h5>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-4 border p-4">
          <h3>Personal Details</h3>
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              id="fullName"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              id="phoneNumber"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              id="dateOfBirth"
              value={dateOfBirth}
              onChange={e => setDateOfBirth(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="gender" className="form-label">Gender</label>
            <Select
              id="gender"
              value={gender}
              onChange={setGender}
              options={options}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">Address</label>
            <Select
              id="address"
              options={addressOptions}
              value={address}
              onChange={setAddress}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="industry" className="form-label">Industry</label>
            <Select
              id="industry"
              options={industryOptions}
              value={industry}
              onChange={setIndustry}
              required
            />
          </div>
        </div>
  
        <div className="mb-4 border p-4">
          <h3>Experience</h3>
          {experience.map((exp, index) => (
            <div key={index} className="mb-3">
              <h5>Experience {index + 1}</h5>
              <div className="mb-2">
                <label htmlFor={`jobTitle${index}`} className="form-label">Job Title</label>
                <Select
                  options={availableJobTitles}
                  value={exp.jobTitle}
                  onChange={selectedOption => handleExperienceJobTitleChange(index, selectedOption)}
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor={`salaryRange${index}`} className="form-label">Salary Range</label>
                <Select
                  options={salaryRanges}
                  value={exp.salaryRange}
                  onChange={selectedOption => handleExperienceSalaryRangeChange(index, selectedOption)}
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor={`company${index}`} className="form-label">Company</label>
                <input
                  type="text"
                  className="form-control"
                  id={`company${index}`}
                  name="company"
                  value={exp.company}
                  onChange={event => handleExperienceChange(index, event)}
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor={`location${index}`} className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  id={`location${index}`}
                  name="location"
                  value={exp.location}
                  onChange={event => handleExperienceChange(index, event)}
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor={`startDate${index}`} className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  id={`startDate${index}`}
                  name="startDate"
                  value={exp.startDate}
                  onChange={event => handleExperienceChange(index, event)}
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor={`endDate${index}`} className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  id={`endDate${index}`}
                  name="endDate"
                  value={exp.endDate}
                  onChange={event => handleExperienceChange(index, event)}
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor={`description${index}`} className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id={`description${index}`}
                  name="description"
                  value={exp.description}
                  onChange={event => handleExperienceChange(index, event)}
                  required
                />
              </div>
              <button type="button" className="btn btn-danger" onClick={() => handleRemoveExperience(index)}>Remove Experience</button>
            </div>
          ))}
          <button type="button" className="btn btn-primary" onClick={handleAddExperience}>Add Experience</button>
        </div>
  
        <div className="mb-4 border p-4">
          <h3>Skills</h3>
          {skills.map((skill, index) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <Select
                options={availableSkills}
                value={skill}
                onChange={selectedOption => handleSkillChange(index, selectedOption)}
                className="me-2"
                required
              />
              <button type="button" className="btn btn-danger" onClick={() => handleRemoveSkill(index)}>Remove</button>
            </div>
          ))}
          <button type="button" className="btn btn-primary" onClick={handleAddSkill}>Add Skill</button>
        </div>
  
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-success">Submit</button>
      </form>
  
      <Modal show={showModal} onHide={handleModalCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to submit your profile?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleModalSubmit}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
 }  

export default ProfileEditForm;

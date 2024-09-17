import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';

function ProfileCreation() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('Juan A. Dela Cruz');
  const [phoneNumber, setPhoneNumber] = useState('+44 1245 572 135');
  const [email, setEmail] = useState('juandelacruz@gmail.com');
  const [dateOfBirth, setDateOfBirth] = useState('1997-08-09');
  const [gender, setGender] = useState('Male');
  const [address, setAddress] = useState(null);
  const [addressOptions, setAddressOptions] = useState([]);
  const [industry, setIndustry] = useState(null);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [experience, setExperience] = useState([
    {
      jobTitle: null,
      salaryRange: null,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user_id = sessionStorage.getItem('userId');

    const profileData = {
      user_id,
      fullName,
      phoneNumber,
      email,
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
      photo
    };

    try {
      const response = await fetch('http://localhost:5000/api/jobseekers/profile', {
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

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Submission failed:', err);
      setError('Failed to submit the profile. Please try again.');
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const userId = sessionStorage.getItem('userId');
  
    if (!file) {
      console.error('No file selected');
      return;
    }
  
    const formData = new FormData();
    formData.append('profilePicture', file);
  
    try {
      const response = await fetch(`http://localhost:5000/api/upload-profile-picture/${userId}`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      setPhoto(data.profilePictureUrl);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };
  
  useEffect(() => {
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

    fetchSkills();
    fetchJobTitles();
    fetchAddresses();
    fetchIndustries();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-center">Create your Profile</h1>
      <h5 className="text-center">Let us know more about you</h5>
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
          </div>
        </div>
        <div className="mb-4 border p-4">
          <h3>Personal Details</h3>
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">Full Name *</label>
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
              <label htmlFor="phoneNumber" className="form-label">Phone Number *</label>
              <input
                type="tel"
                className="form-control"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="email" className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="dateOfBirth" className="form-label">Date of Birth *</label>
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
              <label htmlFor="gender" className="form-label">Gender *</label>
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
            <label htmlFor="address" className="form-label">Address *</label>
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
        </div>

        <div className="mb-4 border p-4">
          <h3>Experience</h3>
          {experience.map((exp, index) => (
            <div key={index} className="mb-3">
              <label className="form-label">Experience {index + 1}</label>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor={`jobTitle-${index}`} className="form-label">Job Title</label>
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
                  <label htmlFor={`salaryRange-${index}`} className="form-label">Salary Range</label>
                  <Select
                    id={`salaryRange-${index}`}
                    options={salaryRanges}
                    value={exp.salaryRange}
                    onChange={(selectedOption) => handleExperienceSalaryRangeChange(index, selectedOption)}
                    placeholder="Select Salary Range"
                    isClearable
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor={`company-${index}`} className="form-label">Company</label>
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
                  <label htmlFor={`location-${index}`} className="form-label">Location</label>
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
                  <label htmlFor={`startDate-${index}`} className="form-label">Start Date</label>
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
                  <label htmlFor={`endDate-${index}`} className="form-label">End Date</label>
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
                <label htmlFor={`description-${index}`} className="form-label">Description</label>
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
              <label className="form-label">Skill {index + 1}</label>
              <div className="d-flex">
                <Select
                  options={availableSkills}
                  value={skill}
                  onChange={(selectedOption) => handleSkillChange(index, selectedOption)}
                  placeholder="Select Skill"
                  isClearable
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

        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-success">Submit Profile</button>
        </div>
      </form>
    </div>
  );
}

export default ProfileCreation;


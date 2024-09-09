import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function ProfileCreation() {
  const navigate = useNavigate(); 

  const [fullName, setFullName] = useState('Juan A. Dela Cruz');
  const [phoneNumber, setPhoneNumber] = useState('+44 1245 572 135');
  const [email, setEmail] = useState('juandelacruz@gmail.com');
  const [dateOfBirth, setDateOfBirth] = useState('1997-08-09');
  const [gender, setGender] = useState('Male');
  const [address, setAddress] = useState('Galamay-Amo, San Jose');
  const [experience, setExperience] = useState([{
    jobTitle: '',
    salary: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
  }]);
  const [skills, setSkills] = useState([{ value: '' }]);
  const [error, setError] = useState('');

  const handleSkillChange = (index, event) => {
    const newSkills = skills.slice();
    newSkills[index].value = event.target.value;
    setSkills(newSkills);
  };

  const handleAddSkill = () => {
    setSkills([...skills, { value: '' }]);
  };

  const handleRemoveSkill = (index) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
  };

  const handleExperienceChange = (index, event) => {
    const { name, value } = event.target;
    const newExperience = experience.slice();
    newExperience[index] = { ...newExperience[index], [name]: value };
    setExperience(newExperience);
  };

  const handleAddExperience = () => {
    setExperience([...experience, {
      jobTitle: '',
      salary: '',
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

    const user_id = sessionStorage.getItem('userId'); // Or localStorage.getItem('userId');

    const profileData = {
      user_id,
      fullName,
      phoneNumber,
      email,
      dateOfBirth,
      gender,
      address,
      skills: skills.map(skill => skill.value),
      experience,
    };

    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Profile created successfully:', data);

      // Navigate to login page after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Submission failed:', err);
      setError('Failed to submit the profile. Please try again.');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // Handle file upload logic here
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center">Create your Profile</h1>
      <form onSubmit={handleSubmit}>
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
            <label htmlFor="email" className="form-label">Email *</label>
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
              id="gender"
              className="form-select"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <h3>Work Experience</h3>
        {experience.map((exp, index) => (
          <div key={index} className="mb-3 border p-3">
            <div className="mb-3">
              <label htmlFor={`jobTitle-${index}`} className="form-label">Job Title *</label>
              <input
                type="text"
                className="form-control"
                id={`jobTitle-${index}`}
                name="jobTitle"
                value={exp.jobTitle}
                onChange={(e) => handleExperienceChange(index, e)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor={`salary-${index}`} className="form-label">Salary</label>
              <input
                type="text"
                className="form-control"
                id={`salary-${index}`}
                name="salary"
                value={exp.salary}
                onChange={(e) => handleExperienceChange(index, e)}
              />
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor={`company-${index}`} className="form-label">Company *</label>
                <input
                  type="text"
                  className="form-control"
                  id={`company-${index}`}
                  name="company"
                  value={exp.company}
                  onChange={(e) => handleExperienceChange(index, e)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor={`location-${index}`} className="form-label">Location *</label>
                <input
                  type="text"
                  className="form-control"
                  id={`location-${index}`}
                  name="location"
                  value={exp.location}
                  onChange={(e) => handleExperienceChange(index, e)}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor={`startDate-${index}`} className="form-label">Start Date *</label>
                <input
                  type="date"
                  className="form-control"
                  id={`startDate-${index}`}
                  name="startDate"
                  value={exp.startDate}
                  onChange={(e) => handleExperienceChange(index, e)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor={`endDate-${index}`} className="form-label">End Date *</label>
                <input
                  type="date"
                  className="form-control"
                  id={`endDate-${index}`}
                  name="endDate"
                  value={exp.endDate}
                  onChange={(e) => handleExperienceChange(index, e)}
                  required
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
                onChange={(e) => handleExperienceChange(index, e)}
              ></textarea>
            </div>
            <button type="button" className="btn btn-danger" onClick={() => handleRemoveExperience(index)}>Remove Experience</button>
          </div>
        ))}
        <button type="button" className="btn btn-primary mb-3" onClick={handleAddExperience}>Add Experience</button>
        <h3>Skills</h3>
        {skills.map((skill, index) => (
          <div key={index} className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              value={skill.value}
              onChange={(e) => handleSkillChange(index, e)}
              required
            />
            <button type="button" className="btn btn-outline-danger" onClick={() => handleRemoveSkill(index)}>Remove</button>
          </div>
        ))}
        <button type="button" className="btn btn-primary mb-3" onClick={handleAddSkill}>Add Skill</button>
        <div className="mb-3">
          <label htmlFor="resume" className="form-label">Upload your Resume *</label>
          <input
            type="file"
            className="form-control"
            id="resume"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-success">Submit</button>
        </div>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </div>
  );
}

export default ProfileCreation;

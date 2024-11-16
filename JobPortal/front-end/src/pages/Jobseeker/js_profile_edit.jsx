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
  const [gender, setGender] = useState('');
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

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ];

  useEffect(() => {
    if (!userId) return;
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobseekers/fetchjobseeker-profile/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch profile data');
        const data = await response.json();

        if (data.jobSeeker) {
          setFullName(data.jobSeeker.fullName || '');
          setPhoneNumber(data.jobSeeker.phoneNumber || '');
          const date = new Date(data.jobSeeker.dateOfBirth);
          setDateOfBirth(date.toISOString().split('T')[0]);
          setGender(data.jobSeeker.gender || ''); 
          setAddress({ value: data.jobSeeker.address_id,
            label: data.jobSeeker.address_name
            
          });
          setIndustry({ value: data.jobSeeker.industry_id,
            label: data.jobSeeker.industry_name
           
          });

          const formattedExperiences = data.jobSeeker.experiences.map(exp => ({
            jobTitle: { value: exp.jobTitleId, label: exp.jobTitleName },
            salaryRange: { value: exp.salary, label: exp.salary },
            company: exp.companyName || '',
            location: exp.location || '',
            startDate: new Date(exp.startDate).toISOString().split('T')[0],
            endDate: new Date(exp.endDate).toISOString().split('T')[0],
            description: exp.description || '',
          }));
          setExperience(formattedExperiences);

          const skillsArray = data.jobSeeker.skills.map(skill => ({
            value: skill.skillId,
            label: skill.skillName,
          })) || [];
          setSkills(skillsArray);
        } else {
          setError('No profile data found.');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Failed to load profile data.');
      }
    };

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

    fetchProfileData();
    fetchSkills();
    fetchJobTitles();
    fetchAddresses();
    fetchIndustries();
  }, [userId]);

  const handleSkillChange = (index, selectedOption) => {
    const newSkills = [...skills];
    newSkills[index] = selectedOption;
    setSkills(newSkills);
  };

  const handleAddSkill = () => {
    setSkills([...skills, { value: '', label: '' }]);
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
    setShowModal(true);
  };

  const handleModalSubmit = async () => {
    setShowModal(false);
    await handleSubmit();
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  const handleSubmit = async () => {
    const user_id = sessionStorage.getItem('user_id');

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
      profile_picture_url: ''
    };

    console.log('Profile Data being sent:', profileData);
      console.log('Address:', address);
      console.log('Industry:', industry);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobseekers/update-jobseeker-profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      console.log('Profile updated successfully!');
      navigate(`/js_myprofile`);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile.');
    }
  };

  return (
    <div className="container">
      <div className="mb-4">
      <h1 className="text-center" style={{ marginTop: "45px" }}>
          Edit your Profile
      </h1>
        <h5 className="text-center">Update any changes to your information</h5>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleFormSubmit}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-control" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input type="tel" className="form-control" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Date of Birth</label>
          <input type="date" className="form-control" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
        </div>
        <div className="mb-3">
            <label htmlFor="gender" className="form-label">Gender</label>
            <select
                id="gender"
                className="form-select"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
            >
                <option value="" disabled>Select gender</option>
                {genderOptions.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <Select
            id="address"
            value={address}
            onChange={setAddress}
            options={addressOptions}
            isClearable
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Industry</label>
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
          <h4>Experience</h4>
          {experience.map((exp, index) => (
            <div key={index} className="border p-3 mb-2">
              <label>Job Title</label>
              <Select
                value={exp.jobTitle}
                onChange={(selectedOption) => handleExperienceJobTitleChange(index, selectedOption)}
                options={availableJobTitles}
                required
              />
              <label>Salary Range</label>
              <Select
                value={exp.salaryRange}
                onChange={(selectedOption) => handleExperienceSalaryRangeChange(index, selectedOption)}
                options={salaryRanges}
                required
              />
              <div className="mb-3">
                <label>Company</label>
                <input type="text" name="company" className="form-control" value={exp.company} onChange={(e) => handleExperienceChange(index, e)} required />
              </div>
              <div className="mb-3">
                <label>Location</label>
                <input type="text" name="location" className="form-control" value={exp.location} onChange={(e) => handleExperienceChange(index, e)} required />
              </div>
              <div className="mb-3">
                <label>Start Date</label>
                <input type="date" name="startDate" className="form-control" value={exp.startDate} onChange={(e) => handleExperienceChange(index, e)} required />
              </div>
              <div className="mb-3">
                <label>End Date</label>
                <input type="date" name="endDate" className="form-control" value={exp.endDate} onChange={(e) => handleExperienceChange(index, e)} required />
              </div>
              <div className="mb-3">
                <label>Description</label>
                <textarea name="description" className="form-control" value={exp.description} onChange={(e) => handleExperienceChange(index, e)} required />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleRemoveExperience(index)}
              >
                Remove Experience
              </button>
            </div>

            </div>
          ))}
         <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleAddExperience}
          >
              Add Experience
          </button>
      </div>

        </div>
        <div className="mb-3">
          <h4>Skills</h4>
          {skills.map((skill, index) => (
            <div key={index} className="border p-3 mb-2">
              <Select
                value={skill}
                onChange={(selectedOption) => handleSkillChange(index, selectedOption)}
                options={availableSkills}
              />
                 <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="button" className="btn btn-danger" onClick={() => handleRemoveSkill(index)}>Remove Skill</button>
              </div>
            </div>
          ))}
             <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="button" className="btn btn-primary" onClick={handleAddSkill}>Add Skill</button>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button type="submit" className="btn btn-success">Save Changes</button>
        </div>
      </form>

      <Modal show={showModal} onHide={handleModalCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to save the changes?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalCancel}>Cancel</Button>
          <Button variant="primary" onClick={handleModalSubmit}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProfileEditForm;

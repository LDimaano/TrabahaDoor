import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/profilecreation.module.css';

function ProfileCreation() {
  const navigate = useNavigate(); 

  const [fullName, setFullName] = useState('Juan A. Dela Cruz');
  const [phoneNumber, setPhoneNumber] = useState('+44 1245 572 135');
  const [email, setEmail] = useState('juandelacruz@gmail.com');
  const [dateOfBirth, setDateOfBirth] = useState('1997-08-09');
  const [gender, setGender] = useState('Male');
  const [address, setAddress] = useState('Galamay-Amo, San Jose');
  const [jobTitle, setJobTitle] = useState('Elementary Teacher');
  const [salary, setSalary] = useState('₱22,000');
  const [company, setCompany] = useState('South College');
  const [location, setLocation] = useState('Abra, San Jose');
  const [startDate, setStartDate] = useState('2020-08-09');
  const [endDate, setEndDate] = useState('2024-02-01');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState([{ value: '' }]);
  const [experience, setExperience] = useState([{
    jobTitle: '',
    salary: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
  }]);
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

    console.log('Submitting profile data:', profileData);

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
      }, 3000); // Adjust the delay as needed
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
    <main className={styles.profileCreation}>
      <div className={styles.content}>
        <nav className={styles.topNav}>
          <h1 className={styles.pageTitle}>Create your Profile</h1>
          <div className={styles.action}>
            <button className={styles.backButton}>Back to homepage</button>
            <img src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`} alt="TrabahaDoor logo" className={styles.logoImage} />
          </div>
        </nav>
        <div className={styles.mainContent}>
          <nav className={styles.tabs}>
            <div className={styles.tabItem}>
              <span className={styles.tabText}>My Profile</span>
              <div className={styles.activeIndicator} />
            </div>
            <div className={styles.tabItem} />
            <div className={styles.tabItem} />
          </nav>
          <section className={styles.profileDetails}>
          <section className={styles.basicInformation}>
              <h2 className={styles.sectionTitle}>Basic Information</h2>
              <p className={styles.sectionDescription}>
                This is your personal information that you can update anytime.
              </p>
            </section>
            <hr className={styles.divider} />
            <section className={styles.profilePhoto}>
              <div className={styles.photoInfo}>
                <h3 className={styles.photoTitle}>Profile Photo</h3>
                <p className={styles.photoDescription}>
                  This image will be shown publicly as your profile picture, it will help recruiters recognize you!
                </p>
              </div>
              <div className={styles.photoUpload}>
                <div className={styles.uploadArea}>
                  <label htmlFor="profilePhotoUpload" className={styles.uploadLabel}>
                    <img src="http://b.io/ext_10-" alt="" className={styles.uploadIcon} />
                    <p className={styles.uploadInstructions}>
                      <span className={styles.clickToReplace}>Click to replace</span> or drag and drop
                    </p>
                    <p className={styles.fileRequirements}>PNG, or JPG (max. 400 x 400px)</p>
                  </label>
                  <input
                    type="file"
                    id="profilePhotoUpload"
                    accept="image/png, image/jpeg"
                    className={styles.fileInput}
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </section>
            <hr className={styles.divider} />
            <section className={styles.personalDetails}>
              <h3 className={styles.sectionTitle}>Personal Details</h3>
              <form className={styles.detailsForm}>
                <div className={styles.inputField}>
                  <label htmlFor="fullName" className={styles.label}>
                    Full Name <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    className={styles.input}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.row}>
                  <div className={styles.inputField}>
                    <label htmlFor="phoneNumber" className={styles.label}>
                      Phone Number <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      className={styles.input}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.inputField}>
                    <label htmlFor="email" className={styles.label}>
                      Email <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      className={styles.input}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.dropdownField}>
                    <label htmlFor="dateOfBirth" className={styles.label}>
                      Date of Birth <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.dropdown}>
                      <input
                        type="date"
                        id="dateOfBirth"
                        className={styles.select}
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        required
                      />
                      <img src="http://b.io/ext_11-" alt="" className={styles.dropdownIcon} />
                    </div>
                  </div>
                  <div className={styles.dropdownField}>
                    <label htmlFor="gender" className={styles.label}>
                      Gender <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.dropdown}>
                      <select
                        id="gender"
                        className={styles.select}
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <img src="http://b.io/ext_11-" alt="" className={styles.dropdownIcon} />
                    </div>
                  </div>
                </div>
                <div className={styles.inputField}>
                  <label htmlFor="address" className={styles.label}>
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    className={styles.input}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </form>
            </section>
            <hr className={styles.divider} />
            <section className={styles.workExperience}>
              <h3 className={styles.sectionTitle}>Work Experience</h3>
              {experience.map((exp, index) => (
                <form key={index} className={styles.experienceForm}>
                  <div className={styles.inputField}>
                    <label htmlFor={`jobTitle-${index}`} className={styles.label}>
                      Title <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id={`jobTitle-${index}`}
                      name="jobTitle"
                      className={styles.input}
                      value={exp.jobTitle}
                      onChange={(e) => handleExperienceChange(index, e)}
                      required
                    />
                  </div>
                  <div className={styles.inputField}>
                    <label htmlFor={`salary-${index}`} className={styles.label}>
                      Salary
                    </label>
                    <input
                      type="text"
                      id={`salary-${index}`}
                      name="salary"
                      className={styles.input}
                      value={exp.salary}
                      onChange={(e) => handleExperienceChange(index, e)}
                    />
                  </div>
                  <div className={styles.row}>
                    <div className={styles.inputField}>
                      <label htmlFor={`company-${index}`} className={styles.label}>
                        Company <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        id={`company-${index}`}
                        name="company"
                        className={styles.input}
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, e)}
                        required
                      />
                    </div>
                    <div className={styles.inputField}>
                      <label htmlFor={`location-${index}`} className={styles.label}>
                        Location <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        id={`location-${index}`}
                        name="location"
                        className={styles.input}
                        value={exp.location}
                        onChange={(e) => handleExperienceChange(index, e)}
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.dropdownField}>
                      <label htmlFor={`startDate-${index}`} className={styles.label}>
                        Start Date <span className={styles.required}>*</span>
                      </label>
                      <div className={styles.dropdown}>
                        <input
                          type="date"
                          id={`startDate-${index}`}
                          name="startDate"
                          className={styles.select}
                          value={exp.startDate}
                          onChange={(e) => handleExperienceChange(index, e)}
                          required
                        />
                        <img src="http://b.io/ext_11-" alt="" className={styles.dropdownIcon} />
                      </div>
                    </div>
                    <div className={styles.dropdownField}>
                      <label htmlFor={`endDate-${index}`} className={styles.label}>
                        End Date <span className={styles.required}>*</span>
                      </label>
                      <div className={styles.dropdown}>
                        <input
                          type="date"
                          id={`endDate-${index}`}
                          name="endDate"
                          className={styles.select}
                          value={exp.endDate}
                          onChange={(e) => handleExperienceChange(index, e)}
                          required
                        />
                        <img src="http://b.io/ext_11-" alt="" className={styles.dropdownIcon} />
                      </div>
                    </div>
                  </div>
                  <div className={styles.inputField}>
                  <label htmlFor={`description-${index}`} className={styles.label}>
                      Description <span className={styles.required}>*</span>
                    </label>
                    <textarea
                      id={`description-${index}`}
                      name="description"
                      className={styles.textarea}
                      value={exp.description}
                      onChange={(e) => handleExperienceChange(index, e)}
                      required
                    />
                  </div>
                  <button type="button" className={styles.removeExperience} onClick={() => handleRemoveExperience(index)}>Remove</button>
                </form>
              ))}
              <button type="button" className={styles.addExperience} onClick={handleAddExperience}>+ Add More Experience</button>
            </section>
            <hr className={styles.divider} />
            <section className={styles.skills}>
              <div className={styles.sectionTitle}>
                Skills <span className={styles.required}>*</span>
              </div>
              {skills.map((skill, index) => (
                <div key={index} className={styles.inputField}>
                  <input
                    type="text"
                    id={`skill-${index}`}
                    className={styles.input}
                    value={skill.value}
                    onChange={(e) => handleSkillChange(index, e)}
                    required
                  />
                  <button type="button" className={styles.removeSkill} onClick={() => handleRemoveSkill(index)}>Remove</button>
                </div>
              ))}
              <button type="button" className={styles.addSkill} onClick={handleAddSkill}>+ Add More Skills</button>
            </section>
          </section>
        </div>
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.submitButton} onClick={handleSubmit}>Register</button>
        </div>
      </div>
    </main>
  );
}

export default ProfileCreation;

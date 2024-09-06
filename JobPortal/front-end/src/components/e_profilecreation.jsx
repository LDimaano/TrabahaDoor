import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/profilecreation.module.css';

function EmployerProfileCreation() {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState('Tech Innovations Ltd');
  const [contactPerson, setContactPerson] = useState('Jane Doe');
  const [contactNumber, setContactNumber] = useState('+44 1245 678 901');
  const [email, setEmail] = useState('contact@techinnovations.com');
  const [website, setWebsite] = useState('http://www.techinnovations.com');
  const [industry, setIndustry] = useState('Information Technology');
  const [companyAddress, setCompanyAddress] = useState('123 Tech Lane, Silicon Valley');
  const [companySize, setCompanySize] = useState('500-1000 employees');
  const [foundedYear, setFoundedYear] = useState('2000');
  const [description, setDescription] = useState('Tech Innovations Ltd is a leading IT solutions provider specializing in software development and consulting.');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user_id = sessionStorage.getItem('userId');

    const profileData = {
      user_id,
      companyName,
      contactPerson,
      contactNumber,
      email,
      website,
      industry,
      companyAddress,
      companySize,
      foundedYear,
      description,
    };

    console.log('Submitting profile data:', profileData);

    try {
      const response = await fetch('http://localhost:5000/api/employer-profile', {
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

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   setLogo(file);
  // };

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
                    // onChange={handleFileChange}
                  />
                </div>
              </div>
            </section>
            <hr className={styles.divider} />
            <section className={styles.personalDetails}>
              <h3 className={styles.sectionTitle}>Company Details</h3>
              <form className={styles.detailsForm}>
                <div className={styles.inputField}>
                  <label htmlFor="companyName" className={styles.label}>
                    Company name <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    className={styles.input}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.row}>
                  <div className={styles.inputField}>
                    <label htmlFor="contactPerson" className={styles.label}>
                      Contact person <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="contactPerson"
                      className={styles.input}
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.inputField}>
                    <label htmlFor="contactNumber" className={styles.label}>
                      Contact number <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="tel"
                      id="contactNumber"
                      className={styles.input}
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className={styles.row}>
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
                  <div className={styles.inputField}>
                    <label htmlFor="website" className={styles.label}>
                      Website <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="url"
                      id="website"
                      className={styles.input}
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className={styles.inputField}>
                  <label htmlFor="industry" className={styles.label}>
                    Industry
                  </label>
                  <input
                    type="text"
                    id="industry"
                    className={styles.input}
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  />
                </div>
              </form>
            </section>
            <hr className={styles.divider} />
            <section className={styles.workExperience}>
              <h3 className={styles.sectionTitle}>Additional Information</h3>
              <form className={styles.experienceForm}>
                <div className={styles.inputField}>
                  <label htmlFor="companyAddress" className={styles.label}>
                    Company address <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="companyAddress"
                    className={styles.input}
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.inputField}>
                  <label htmlFor="companySize" className={styles.label}>
                    Company size
                  </label>
                  <input
                    type="text"
                    id="companySize"
                    className={styles.input}
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                  />
                </div>
                <div className={styles.row}>
                  <div className={styles.inputField}>
                    <label htmlFor="foundedYear" className={styles.label}>
                      Founded year <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="foundedYear"
                      className={styles.input}
                      value={foundedYear}
                      onChange={(e) => setFoundedYear(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className={styles.inputField}>
                  <label htmlFor="description" className={styles.label}>
                    Description <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    id="description"
                    className={styles.textarea}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    maxLength={400}
                    required
                  />
                </div>
              </form>
            </section>
            <div className={styles.buttonContainer}>
              <button type="submit" className={styles.submitButton} onClick={handleSubmit}>Register</button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default EmployerProfileCreation;

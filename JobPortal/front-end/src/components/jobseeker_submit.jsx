import React, { useState } from 'react';
import Modal from './modal'; 
import styles from '../css/jobseeker_submit.module.css'; 

const FormField = ({ label, type, placeholder, id }) => {
  return (
    <div className={styles.formField}>
      <label htmlFor={id} className={styles.formLabel}>{label}</label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className={styles.formInput}
        aria-label={label}
      />
    </div>
  );
};

const JobHeader = ({ logo, title, company, location, jobType }) => {
  return (
    <header className={styles.header}>
      <div className={styles.roleInfo}>
        <img src={logo} alt={`${company} logo`} className={styles.companyLogo} />
        <div className={styles.jobDetails}>
          <h1 className={styles.jobTitle}>{title}</h1>
          <div className={styles.jobMetadata}>
            <span className={styles.metadataItem}>{company}</span>
            <span className={styles.metadataItem}>{location}</span>
            <span className={styles.metadataItem}>{jobType}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

const AdditionalInfo = () => {
  return (
    <div className={styles.additionalInfo}>
      <label htmlFor="additionalInfo" className={styles.additionalInfoLabel}>Additional information</label>
      <div className={styles.additionalInfoContent}>
        <textarea
          id="additionalInfo"
          className={styles.additionalInfoTextarea}
          placeholder="Add a cover letter or anything else you want to share"
          aria-label="Additional information"
        ></textarea>
        <div className={styles.helperText}>
          <span className={styles.characterLimit}>Maximum 500 characters</span>
          <span className={styles.characterCount}>0 / 500</span>
        </div>
      </div>
    </div>
  );
};

const SubmitApplication = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const modalContent = (
    <div className={styles.container}>
      <section className={styles.base}>
        <JobHeader
          logo="https://cdn.builder.io/api/v1/image/assets/TEMP/4510ed17dfd1da1e2f074cd5249c6b7e6c149301121221461cda3b29e3cb81e3?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae"
          title="Teacher - Primary Level"
          company="Saint Anthony Montessori"
          location="San Jose, Batangas"
          jobType="Full-Time"
        />
        <hr className={styles.divider} />
        <div className={styles.formSection}>
          <h2 className={styles.formTitle}>Submit your application</h2>
          <p className={styles.formDescription}>
            The following is required and will only be shared with Nomad
          </p>
        </div>
        <form>
          <FormField label="Full name" type="text" placeholder="Enter your fullname" id="fullName" />
          <FormField label="Email address" type="email" placeholder="Enter your email address" id="email" />
          <FormField label="Phone number" type="tel" placeholder="Enter your phone number" id="phone" />
          <hr className={styles.divider} />
          <AdditionalInfo />
          <hr className={styles.divider} />
          <button type="submit" className={styles.submitButton}>Submit Application</button>
          <p className={styles.termsText}>
            By sending the request you can confirm that you accept our{" "}
            <a href="#terms" className={styles.termsLink}>Terms of Service</a> and{" "}
            <a href="#privacy" className={styles.privacyLink}>Privacy Policy</a>
          </p>
        </form>
      </section>
    </div>
  );

  return (
    <>
      <button onClick={openModal} className={styles.applyButton}>Apply Now</button>
      <Modal isOpen={isModalOpen} onClose={closeModal} content={modalContent} />
    </>
  );
};

export default SubmitApplication;

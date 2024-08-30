import React, { useState } from 'react';
import Modal from './modal'; 
import '../css/jobseeker_submit.css'; 

const FormField = ({ label, type, placeholder, id }) => {
  return (
    <div className="formField">
      <label htmlFor={id} className="formLabel">{label}</label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className="formInput"
        aria-label={label}
      />
    </div>
  );
};

const JobHeader = ({ logo, title, company, location, jobType }) => {
  return (
    <header className="header">
      <div className="roleInfo">
        <img src={logo} alt={`${company} logo`} className="companyLogo" />
        <div className="jobDetails">
          <h1 className="jobTitle">{title}</h1>
          <div className="jobMetadata">
            <span className="metadataItem">{company}</span>
            <span className="metadataItem">{location}</span>
            <span className="metadataItem">{jobType}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

const AdditionalInfo = () => {
  return (
    <div className="additionalInfo">
      <label htmlFor="additionalInfo" className="additionalInfoLabel">Additional information</label>
      <div className="additionalInfoContent">
        <textarea
          id="additionalInfo"
          className="additionalInfoTextarea"
          placeholder="Add a cover letter or anything else you want to share"
          aria-label="Additional information"
        ></textarea>
        <div className="helperText">
          <span className="characterLimit">Maximum 500 characters</span>
          <span className="characterCount">0 / 500</span>
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
    <div className="container">
      <section className="base">
        <JobHeader
          logo="https://cdn.builder.io/api/v1/image/assets/TEMP/4510ed17dfd1da1e2f074cd5249c6b7e6c149301121221461cda3b29e3cb81e3?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae"
          title="Teacher - Primary Level"
          company="Saint Anthony Montessori"
          location="San Jose, Batangas"
          jobType="Full-Time"
        />
        <hr className="divider" />
        <div className="formSection">
          <h2 className="formTitle">Submit your application</h2>
          <p className="formDescription">
            The following is required and will only be shared with Nomad
          </p>
        </div>
        <form>
          <FormField label="Full name" type="text" placeholder="Enter your fullname" id="fullName" />
          <FormField label="Email address" type="email" placeholder="Enter your email address" id="email" />
          <FormField label="Phone number" type="tel" placeholder="Enter your phone number" id="phone" />
          <hr className="divider" />
          <AdditionalInfo />
          <hr className="divider" />
          <button type="submit" className="submitButton">Submit Application</button>
          <p className="termsText">
            By sending the request you can confirm that you accept our{" "}
            <a href="#terms">Terms of Service</a> and{" "}
            <a href="#privacy">Privacy Policy</a>
          </p>
        </form>
      </section>
    </div>
  );

  return (
    <>
      <button onClick={openModal} className="applyButton">Apply Now</button>
      <Modal isOpen={isModalOpen} onClose={closeModal} content={modalContent} />
    </>
  );
};

export default SubmitApplication;

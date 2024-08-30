import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import styles from '../css/jobposting_desc.module.css';

// TopNav Component
function TopNav() {
  return (
    <header className={styles.topNav}>
      <div className={styles.companyInfo}>
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/1d41edab7dfd7b603d5a4ad1ca09c3c8f114a2c36e787393ece6fc0064e84327?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
          alt="Company logo" 
          className={styles.companyLogo} 
        />
        <div className={styles.companyDetails}>
          <p className={styles.companyName}>Company</p>
          <h1 className={styles.companyTitle}>
            Saint Anthony Montessori
            <img 
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/094d56e22dd1b07143c6e0b7804b4e8167234f7715ffe38b80659cd99184a939?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
              alt="Verified badge" 
              className={styles.verifiedBadge} 
            />
          </h1>
        </div>
      </div>
      <div className={styles.actionArea}>
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/6dac324345bbc13698ac872cc77d9d263753bd48e8f7f2cbe129c409887b48dc?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
          alt="User profile" 
          className={styles.userProfile} 
        />
        <button className={styles.postJobButton}>
          <img 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/2e7d66b5d85410abffc25e2d6f30311bb55cb26c3092bd566c5f85092b3362d6?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
            alt="Post job icon" 
            className={styles.postJobIcon} 
          />
          <span>Post a job</span>
        </button>
      </div>
    </header>
  );
}

// PostJobHeader Component
function PostJobHeader() {
  const navigate = useNavigate();

  // Function to handle the back button click
  const handleBack = () => {
    window.history.back();
  };

  return (
    <section className={styles.postJobHeader}>
      <button className={styles.backButton} onClick={handleBack} aria-label="Go back">
      <FontAwesomeIcon icon={faArrowLeft} className={styles.backIcon} />
    </button>
      <h2 className={styles.postJobTitle}>Post a Job</h2>
    </section>
  );
}
// JobPostingStepper Component
const StepperItem = ({ imgSrc, stepNumber, title, isActive }) => (
  <div className={`${styles.stepperItem} ${isActive ? styles.active : ''}`}>
    <img loading="lazy" src={imgSrc} alt={`Step ${stepNumber} icon`} className={styles.stepIcon} />
    <div className={styles.stepInfo}>
      <div className={styles.stepNumber}>Step {stepNumber}</div>
      <div className={styles.stepTitle}>{title}</div>
    </div>
  </div>
);

const JobPostingStepper = () => {
  const steps = [
    { imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/6a42fd1310401124f065989747c4a4f9f75a4e05167b241e82d076d6bb0a9963?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975", title: "Job Information", isActive: true },
    { imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/46c54760f1a99081a79cc0bf9bcef9fc0e5a10546bbbac656e7081a2d3814873?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975", title: "Job Description", isActive: false },
  ];

  return (
    <nav className={styles.stepper}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <StepperItem
            imgSrc={step.imgSrc}
            stepNumber={index + 1}
            title={step.title}
            isActive={step.isActive}
          />
          {index < steps.length - 1 && <div className={styles.divider} />}
        </React.Fragment>
      ))}
    </nav>
  );
};


// TextAreaField Component
function TextAreaField({ label, description, placeholder }) {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className={styles.textAreaField}>
      <div className={styles.fieldInfo}>
        <label htmlFor={`${label.toLowerCase()}Input`} className={styles.fieldLabel}>{label}</label>
        <p className={styles.fieldDescription}>{description}</p>
      </div>
      <div className={styles.inputWrapper}>
        <textarea
          id={`${label.toLowerCase()}Input`}
          className={styles.textArea}
          placeholder={placeholder}
          aria-label={label}
          value={value}
          onChange={handleChange}
        />
        <div className={styles.textAreaTools}>
          {['bold', 'italic', 'underline', 'list', 'link', 'image'].map((tool) => (
            <button key={tool} type="button" className={styles.toolButton} aria-label={`${tool} text`}>
              <img src={`http://b.io/ext_${tool}-`} alt={`${tool} icon`} className={styles.toolIcon} />
            </button>
          ))}
        </div>
        <div className={styles.characterCount}>
          <span className={styles.maxCharacters}>Maximum 500 characters</span>
          <span className={styles.currentCount}>{value.length} / 500</span>
        </div>
      </div>
    </div>
  );
}

// JobDetailsForm Component
function JobDetailsForm() {
  const formFields = [
    { label: "Job Descriptions", description: "Job titles must describe one position", placeholder: "Enter job description" },
    { label: "Responsibilities", description: "Outline the core responsibilities of the position", placeholder: "Enter job responsibilities" },
    { label: "Qualifications", description: "Outline the qualifications of the position", placeholder: "Enter job qualifications" }
  ];

  return (
    <form className={styles.jobDetailsForm}>
      <h2 className={styles.formTitle}>Details</h2>
      <p className={styles.formDescription}>
        Add the description of the job, responsibilities, who you are, and nice-to-haves.
      </p>
      <hr className={styles.formDivider} />
      {formFields.map((field, index) => (
        <React.Fragment key={field.label}>
          <TextAreaField {...field} />
          {index < formFields.length - 1 && <hr className={styles.formDivider} />}
        </React.Fragment>
      ))}
    </form>
  );
}

// JobPostingPage Component
function JobPostingPage() {
  return (
    <main className={styles.jobPostingPage}>
      <TopNav />
      <PostJobHeader />
      <JobPostingStepper />
      <JobDetailsForm />
      <button className={styles.nextStepButton}>Post Job</button>
    </main>
  );
}

export default JobPostingPage;

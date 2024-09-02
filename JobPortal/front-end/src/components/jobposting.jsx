import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import styles from '../css/jobposting.module.css';

// JobPostingHeader Component
const JobPostingHeader = ({ companyName, jobTitle }) => (
  <header className={styles.topNav}>
    <div className={styles.jobInfo}>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/7bfd4e89c8afcd8bf4ff019356b512cd59d403f9a8316d7fb1b51aad7d2b6902?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
        alt="Company logo"
        className={styles.companyLogo}
      />
      <div className={styles.jobDetails}>
        <div className={styles.companyName}>{companyName}</div>
        <div className={styles.jobTitleWrapper}>
          <h1 className={styles.jobTitle}>{jobTitle}</h1>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/094d56e22dd1b07143c6e0b7804b4e8167234f7715ffe38b80659cd99184a939?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
            alt="Verified badge"
            className={styles.verifiedBadge}
          />
        </div>
      </div>
    </div>
    <div className={styles.actionArea}>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/6dac324345bbc13698ac872cc77d9d263753bd48e8f7f2cbe129c409887b48dc?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
        alt="User profile"
        className={styles.userProfile}
      />
      <button className={styles.postJobButton}>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/852e2efe240b1c9f07e77883f31c58ee205a3500bf21fea61c9a43cb4e07e5b7?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
          alt="Post job icon"
          className={styles.postJobIcon}
        />
        <span>Post a job</span>
      </button>
    </div>
  </header>
);

// JobPostingTitle Component
const JobPostingTitle = () => (
  <section className={styles.titleSection}>
    <img
      loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/99fa6d6e32ae2151149cadf46ae321386503f8c8964c3d96e855dd827a59b853?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
      alt="Post job icon"
      className={styles.postJobIcon}
    />
    <h2 className={styles.pageTitle}>Post a Job</h2>
  </section>
);

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

// JobInformationForm Component
const FormSection = ({ title, description, children }) => (
  <section className={styles.formSection}>
    <h3 className={styles.sectionTitle}>{title}</h3>
    <p className={styles.sectionDescription}>{description}</p>
    <div className={styles.sectionContent}>{children}</div>
  </section>
);

const InputField = ({ label, placeholder, helperText }) => (
  <div className={styles.inputField}>
    <label htmlFor={label.toLowerCase()} className={styles.inputLabel}>{label}</label>
    <input
      type="text"
      id={label.toLowerCase()}
      className={styles.textInput}
      placeholder={placeholder}
    />
    {helperText && <p className={styles.helperText}>{helperText}</p>}
  </div>
);

const CheckboxGroup = ({ options }) => (
  <div className={styles.checkboxGroup}>
    {options.map((option, index) => (
      <div key={index} className={styles.checkboxItem}>
        <input type="checkbox" id={option.toLowerCase()} className={styles.checkbox} />
        <label htmlFor={option.toLowerCase()} className={styles.checkboxLabel}>{option}</label>
      </div>
    ))}
  </div>
);


const SalaryRange = ({ label }) => (
  <div className={styles.dropdown}>
    <div className={styles.selectWrapper}>
      <select id="Salary" className={styles.select}>
      <option value="below-15000">Below ₱15,000</option>
      <option value="15000-25000">₱15,000 - ₱25,000</option>
      <option value="25001-35000">₱25,001 - ₱35,000</option>
      <option value="35001-50000">₱35,001 - ₱50,000</option>
      <option value="50001-75000">₱50,001 - ₱75,000</option>
      <option value="75001-100000">₱75,001 - ₱100,000</option>
      <option value="above-100000">Above ₱100,000</option>
      </select>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/42e47154ee484296a37ad9e22a695392014763876ec4f686befb2efd60116146?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
        alt="Dropdown arrow"
        className={styles.dropdownArrow}
      />
    </div>
  </div>
);

const Dropdown = ({ placeholder }) => (
  <div className={styles.dropdown}>
    <div className={styles.selectWrapper}>
      <select id="industry" className={styles.select}>
        <option value="Select">{placeholder}</option>
      </select>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/42e47154ee484296a37ad9e22a695392014763876ec4f686befb2efd60116146?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
        alt="Dropdown arrow"
        className={styles.dropdownArrow}
      />
    </div>
  </div>
);

const SkillTags = ({ label, placeholder }) => (
  <div className={styles.dropdown}>
    <div className={styles.selectWrapper}>
      <select id="Skills" className={styles.select}>
        <option value="">{placeholder}</option>
      </select>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/42e47154ee484296a37ad9e22a695392014763876ec4f686befb2efd60116146?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
        alt="Dropdown arrow"
        className={styles.dropdownArrow}
      />
    </div>
  </div>
);

const JobInformationForm = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleNextStep = () => {
    navigate('/jobposting_desc'); // Navigate to the next page
  };

  return (
    <form className={styles.jobInformationForm}>
      <FormSection
        title="Basic Information"
        description="This information will be displayed publicly"
      >
        <InputField
          label="Job Title"
          placeholder="e.g. Software Engineer"
          helperText="At least 80 characters"
        />
      </FormSection>

      <FormSection
        title="Type of Employment"
        description="You can select multiple type of employment"
      >
        <CheckboxGroup options={['Full-Time', 'Part-Time', 'Remote', 'Internship', 'Contract']} />
      </FormSection>

      <FormSection
        title="Salary"
        description="Please specify the estimated salary range for the role. *You can leave this blank"
      >
        <SalaryRange />
      </FormSection>

      <FormSection
        title="Industry"
        description="Select in what industry does this job listing belong"
      >
        <Dropdown  placeholder="Select Industry" />
      </FormSection>

      <FormSection
        title="Required Skills"
        description="Add required skills for the job"
      >
        <SkillTags label="Skills" placeholder="Select Skills" />
      </FormSection>

      <button type="button" className={styles.nextStepButton} onClick={handleNextStep}>Next Step</button>
    </form>
  );
};

// JobPostingPage Component
const JobPostingPage = () => (
  <div className={styles.jobPostingPage}>
    <div className={styles.mainContent}>
      <JobPostingHeader companyName="Saint Anthony Montessori" jobTitle="Company" />
      <JobPostingTitle />
      <JobPostingStepper />
      <main className={styles.formContainer}>
        <JobInformationForm />
      </main>
    </div>
  </div>
);

export default JobPostingPage;
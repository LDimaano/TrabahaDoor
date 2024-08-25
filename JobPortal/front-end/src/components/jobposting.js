import React from 'react';
import '../css/jobposting.css';

// JobPostingHeader Component
const JobPostingHeader = ({ companyName, jobTitle }) => {
  return (
    <header className="j-topNav">
      <div className="j-jobInfo">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/7bfd4e89c8afcd8bf4ff019356b512cd59d403f9a8316d7fb1b51aad7d2b6902?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
          alt="Company logo"
          className="j-companyLogo"
        />
        <div className="j-jobDetails">
          <p className="j-companyName">{companyName}</p>
          <h1 className="j-jobTitle">
            {jobTitle}
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/094d56e22dd1b07143c6e0b7804b4e8167234f7715ffe38b80659cd99184a939?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
              alt="Verified icon"
              className="j-verifiedIcon"
            />
          </h1>
        </div>
      </div>
      <div className="j-actionArea">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/6dac324345bbc13698ac872cc77d9d263753bd48e8f7f2cbe129c409887b48dc?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
          alt="User profile"
          className="j-userProfile"
        />
        <button className="j-postJobButton">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/dad4504316a660bd11c1e74ba32c3e057cc14761a1bf1905d4de83474230c0e3?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
            alt="Post job icon"
            className="j-postJobIcon"
          />
          <span>Post a job</span>
        </button>
      </div>
    </header>
  );
};

// JobPostingTitle Component
const JobPostingTitle = () => {
  return (
    <section className="j-titleSection">
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/cdd90f95a417c1b38eccef6d5e6fb67ac273a7a26fe1748256e1e35be3d5e148?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
        alt="Post job icon"
        className="j-postJobIcon"
      />
      <h2 className="j-title">Post a Job</h2>
    </section>
  );
};

// JobPostingSteps Component
const Step = ({ number, title, isActive }) => (
  <div className={`j-step ${isActive ? 'j-activeStep' : ''}`}>
    <img
      loading="lazy"
      src={`http://b.io/ext_${5 + number}-`}
      alt={`Step ${number} icon`}
      className="j-stepIcon"
    />
    <div className="j-stepInfo">
      <p className="j-stepNumber">Step {number}</p>
      <h3 className="j-stepTitle">{title}</h3>
    </div>
  </div>
);

const JobPostingSteps = () => {
  return (
    <nav className="j-stepsNav">
      <Step number={1} title="Job Information" isActive={true} />
      <div className="j-divider" />
      <Step number={2} title="Job Description" isActive={false} />
      <div className="j-divider" />
      <div className="j-emptyStep" />
    </nav>
  );
};

// BasicInformation Component
const BasicInformation = () => {
  return (
    <section className="j-basicInfo">
      <h2 className="j-sectionTitle">Basic Information</h2>
      <p className="j-sectionDescription">
        This information will be displayed publicly
      </p>
      <hr className="j-divider" />
    </section>
  );
};

// JobTitleInput Component
const JobTitleInput = () => {
  return (
    <div className="j-jobTitleContainer">
      <div className="j-labelContainer">
        <label htmlFor="jobTitle" className="j-label">
          Job Title
        </label>
        <p className="j-description">Job titles must describe one position</p>
      </div>
      <div className="j-inputContainer">
        <input
          type="text"
          id="jobTitle"
          className="j-input"
          placeholder="e.g. Software Engineer"
          aria-describedby="jobTitleHelp"
        />
        <p id="jobTitleHelp" className="j-helperText">
          At least 80 characters
        </p>
      </div>
    </div>
  );
};

// EmploymentType Component
const EmploymentTypeOption = ({ label }) => (
  <div className="j-option">
    <input type="checkbox" id={label.toLowerCase()} className="j-checkbox" />
    <label htmlFor={label.toLowerCase()} className="j-label">
      {label}
    </label>
  </div>
);

const EmploymentType = () => {
  const types = [
    'Full-Time',
    'Part-Time',
    'Remote',
    'Internship',
    'Contract',
  ];

  return (
    <div className="j-employmentTypeContainer">
      <div className="j-labelContainer">
        <h3 className="j-title">Type of Employment</h3>
        <p className="j-description">
          You can select multiple types of employment
        </p>
      </div>
      <div className="j-optionsContainer">
        {types.map((type) => (
          <EmploymentTypeOption key={type} label={type} />
        ))}
      </div>
    </div>
  );
};

// SalaryRange Component
const SalaryInput = ({ value }) => (
  <div className="j-salaryInput">
    <span className="j-currencySymbol">₱</span>
    <div className="j-inputDivider" />
    <input
      type="number"
      value={value}
      className="j-input"
      aria-label={`Salary ${value === '5,000' ? 'minimum' : 'maximum'}`}
    />
  </div>
);

const SalaryRange = () => {
  return (
    <div className="j-salaryContainer">
      <div className="j-labelContainer">
        <h3 className="j-title">Salary</h3>
        <p className="j-description">
          Please specify the estimated salary range for the role. *You can leave
          this blank
        </p>
      </div>
      <div className="j-rangeContainer">
        <div className="j-inputGroup">
          <SalaryInput value="5,000" />
          <span className="j-toText">to</span>
          <SalaryInput value="22,000" />
        </div>
        <div className="j-sliderContainer">
          <div className="j-sliderTrack">
            <div className="j-sliderFill" />
          </div>
          <div
            className="j-sliderHandle"
            tabIndex="0"
            role="slider"
            aria-valuemin="5000"
            aria-valuemax="22000"
            aria-valuenow="5000"
          />
          <div
            className="j-sliderHandle"
            tabIndex="0"
            role="slider"
            aria-valuemin="5000"
            aria-valuemax="22000"
            aria-valuenow="22000"
          />
        </div>
      </div>
    </div>
  );
};

// IndustrySelect Component
const IndustrySelect = () => {
  return (
    <div className="j-industryContainer">
      <div className="j-labelContainer">
        <h3 className="j-title">Industry</h3>
        <p className="j-description">
          Select in what industry this job listing belongs
        </p>
      </div>
      <div className="j-selectContainer">
        <label htmlFor="industry" className="j-label">
          Industry
        </label>
        <div className="j-selectWrapper">
          <select id="industry" className="j-select" aria-label="Select Industry">
            <option value="">Select Industry</option>
          </select>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/42e47154ee484296a37ad9e22a695392014763876ec4f686befb2efd60116146?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
            alt="Dropdown arrow"
            className="j-dropdownIcon"
          />
        </div>
      </div>
    </div>
  );
};

const SkillTag = ({ skill }) => (
  <div className="j-skillTag">
    <span>{skill}</span>
    <img
      loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/3eab8a557be1937a6a05fc2e47ee27972310b2030abddfec2ea9af1e8dcc4e72?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
      alt="Remove skill"
      className="j-removeIcon"
    />
  </div>
);

const RequiredSkills = () => {
  const skills = ['Teamwork', 'Communication', 'English'];

  return (
    <div className="j-skillsContainer">
      <div className="j-labelContainer">
        <h3 className="j-title">Required Skills</h3>
        <p className="j-description">Add required skills for the job</p>
      </div>
      <div className="j-skillsContent">
        <button className="j-addSkillButton">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/515da3af76393d2866b60c21fb6f912e64c692b91bc88eaa3fd5f160eb07ac66?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
            alt="Add skill icon"
            className="j-addIcon"
          />
          <span>Add Skills</span>
        </button>
        <div className="j-skillTags">
          {skills.map((skill) => (
            <SkillTag key={skill} skill={skill} />
          ))}
        </div>
      </div>
    </div>
  );
};

// NextStepButton Component
const NextStepButton = () => {
  return (
    <button className="j-nextStepButton">Next Step</button>
  );
};

// JobPostingForm Component
const JobPostingForm = () => {
  return (
    <div className="j-jobPostingContainer">
      <JobPostingHeader companyName="Company" jobTitle="Saint Anthony Montessori" />
      <main className="j-mainContent">
        <JobPostingTitle />
        <JobPostingSteps />
        <form className="j-jobPostingForm">
          <BasicInformation />
          <JobTitleInput />
          <hr className="j-divider" />
          <EmploymentType />
          <hr className="j-divider" />
          <SalaryRange />
          <hr className="j-divider" />
          <IndustrySelect />
          <hr className="j-divider" />
          <RequiredSkills />
          <hr className="j-divider" />
          <NextStepButton />
        </form>
      </main>
    </div>
  );
};

export default JobPostingForm;

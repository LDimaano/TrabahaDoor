import React from 'react';
import '../css/jobposting.css';

const JobPostingHeader = ({ companyName, jobTitle }) => {
  return (
    <header className="topNav">
      <div className="jobInfo">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/7bfd4e89c8afcd8bf4ff019356b512cd59d403f9a8316d7fb1b51aad7d2b6902?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" alt="Company logo" className="companyLogo" />
        <div className="jobDetails">
          <p className="companyName">{companyName}</p>
          <h1 className="jobTitle">
            {jobTitle}
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/094d56e22dd1b07143c6e0b7804b4e8167234f7715ffe38b80659cd99184a939?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" alt="Verified icon" className="verifiedIcon" />
          </h1>
        </div>
      </div>
      <div className="actionArea">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/6dac324345bbc13698ac872cc77d9d263753bd48e8f7f2cbe129c409887b48dc?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" alt="User profile" className="userProfile" />
        <button className="postJobButton">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/dad4504316a660bd11c1e74ba32c3e057cc14761a1bf1905d4de83474230c0e3?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" alt="Post job icon" className="postJobIcon" />
          <span>Post a job</span>
        </button>
      </div>
    </header>
  );
};

const JobPostingTitle = () => {
  return (
    <section className="titleSection">
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/cdd90f95a417c1b38eccef6d5e6fb67ac273a7a26fe1748256e1e35be3d5e148?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" alt="Post job icon" className="postJobIcon" />
      <h2 className="title">Post a Job</h2>
    </section>
  );
};

const Step = ({ number, title, isActive }) => (
  <div className={`step ${isActive ? 'activeStep' : ''}`}>
    <img loading="lazy" src={`http://b.io/ext_${5 + number}-`} alt={`Step ${number} icon`} className="stepIcon" />
    <div className="stepInfo">
      <p className="stepNumber">Step {number}</p>
      <h3 className="stepTitle">{title}</h3>
    </div>
  </div>
);

const JobPostingSteps = () => {
  return (
    <nav className="stepsNav">
      <Step number={1} title="Job Information" isActive={true} />
      <div className="divider" />
      <Step number={2} title="Job Description" isActive={false} />
      <div className="divider" />
      <div className="emptyStep" />
    </nav>
  );
};

const BasicInformation = () => {
  return (
    <section className="basicInfo">
      <h2 className="sectionTitle">Basic Information</h2>
      <p className="sectionDescription">This information will be displayed publicly</p>
      <hr className="divider" />
    </section>
  );
};

const JobTitleInput = () => {
  return (
    <div className="jobTitleContainer">
      <div className="labelContainer">
        <label htmlFor="jobTitle" className="label">Job Title</label>
        <p className="description">Job titles must describe one position</p>
      </div>
      <div className="inputContainer">
        <input
          type="text"
          id="jobTitle"
          className="input"
          placeholder="e.g. Software Engineer"
          aria-describedby="jobTitleHelp"
        />
        <p id="jobTitleHelp" className="helperText">At least 80 characters</p>
      </div>
    </div>
  );
};

const EmploymentTypeOption = ({ label }) => (
  <div className="option">
    <input type="checkbox" id={label.toLowerCase()} className="checkbox" />
    <label htmlFor={label.toLowerCase()} className="label">{label}</label>
  </div>
);

const EmploymentType = () => {
  const types = ['Full-Time', 'Part-Time', 'Remote', 'Internship', 'Contract'];

  return (
    <div className="employmentTypeContainer">
      <div className="labelContainer">
        <h3 className="title">Type of Employment</h3>
        <p className="description">You can select multiple types of employment</p>
      </div>
      <div className="optionsContainer">
        {types.map((type) => (
          <EmploymentTypeOption key={type} label={type} />
        ))}
      </div>
    </div>
  );
};

const SalaryInput = ({ value }) => (
  <div className="salaryInput">
    <span className="currencySymbol">₱</span>
    <div className="inputDivider" />
    <input type="number" value={value} className="input" aria-label={`Salary ${value === '5,000' ? 'minimum' : 'maximum'}`} />
  </div>
);

const SalaryRange = () => {
  return (
    <div className="salaryContainer">
      <div className="labelContainer">
        <h3 className="title">Salary</h3>
        <p className="description">Please specify the estimated salary range for the role. *You can leave this blank</p>
      </div>
      <div className="rangeContainer">
        <div className="inputGroup">
          <SalaryInput value="5,000" />
          <span className="toText">to</span>
          <SalaryInput value="22,000" />
        </div>
        <div className="sliderContainer">
          <div className="sliderTrack">
            <div className="sliderFill" />
          </div>
          <div className="sliderHandle" tabIndex="0" role="slider" aria-valuemin="5000" aria-valuemax="22000" aria-valuenow="5000" />
          <div className="sliderHandle" tabIndex="0" role="slider" aria-valuemin="5000" aria-valuemax="22000" aria-valuenow="22000" />
        </div>
      </div>
    </div>
  );
};

const IndustrySelect = () => {
  return (
    <div className="industryContainer">
      <div className="labelContainer">
        <h3 className="title">Industry</h3>
        <p className="description">Select in what industry this job listing belongs</p>
      </div>
      <div className="selectContainer">
        <label htmlFor="industry" className="label">Industry</label>
        <div className="selectWrapper">
          <select id="industry" className="select" aria-label="Select Industry">
            <option value="">Select Industry</option>
          </select>
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/42e47154ee484296a37ad9e22a695392014763876ec4f686befb2efd60116146?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" alt="Dropdown arrow" className="dropdownIcon" />
        </div>
      </div>
    </div>
  );
};

const SkillTag = ({ skill }) => (
  <div className="skillTag">
    <span>{skill}</span>
    <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/3eab8a557be1937a6a05fc2e47ee27972310b2030abddfec2ea9af1e8dcc4e72?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" alt="Remove skill" className="removeIcon" />
  </div>
);

const RequiredSkills = () => {
  const skills = ['Teamwork', 'Communication', 'English'];

  return (
    <div className="skillsContainer">
      <div className="labelContainer">
        <h3 className="title">Skills</h3>
        <p className="description">Skills that are required for this job</p>
      </div>
      <div className="inputContainer">
        <label htmlFor="skills" className="label">Required skills</label>
        <div className="tagsInputContainer">
          {skills.map((skill) => (
            <SkillTag key={skill} skill={skill} />
          ))}
          <input type="text" id="skills" className="tagsInput" placeholder="Add skills" />
        </div>
      </div>
    </div>
  );
};

const JobPostingForm = () => {
  return (
    <div className="formContainer">
      <JobPostingHeader companyName="OpenAI" jobTitle="Software Engineer" />
      <JobPostingTitle />
      <JobPostingSteps />
      <BasicInformation />
      <JobTitleInput />
      <EmploymentType />
      <SalaryRange />
      <IndustrySelect />
      <RequiredSkills />
    </div>
  );
};

export default JobPostingForm;

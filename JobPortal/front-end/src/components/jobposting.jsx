import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

// JobPostingHeader Component
const JobPostingHeader = ({ companyName, jobTitle }) => (
  <header className="d-flex justify-content-between align-items-center p-3 border-bottom">
    <div className="d-flex align-items-center">
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/7bfd4e89c8afcd8bf4ff019356b512cd59d403f9a8316d7fb1b51aad7d2b6902?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
        alt="Company logo"
        className="me-3"
        style={{ maxWidth: '50px' }}
      />
      <div>
        <div className="fw-bold">{companyName}</div>
        <div className="d-flex align-items-center">
          <h1 className="mb-0">{jobTitle}</h1>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/094d56e22dd1b07143c6e0b7804b4e8167234f7715ffe38b80659cd99184a939?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
            alt="Verified badge"
            className="ms-2"
            style={{ maxWidth: '30px' }}
          />
        </div>
      </div>
    </div>
    <div className="d-flex align-items-center">
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/6dac324345bbc13698ac872cc77d9d263753bd48e8f7f2cbe129c409887b48dc?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
        alt="User profile"
        className="me-3"
        style={{ maxWidth: '40px', borderRadius: '50%' }}
      />
      <button className="btn btn-primary d-flex align-items-center">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/852e2efe240b1c9f07e77883f31c58ee205a3500bf21fea61c9a43cb4e07e5b7?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
          alt="Post job icon"
          className="me-2"
          style={{ maxWidth: '20px' }}
        />
        <span>Post a job</span>
      </button>
    </div>
  </header>
);

// JobPostingTitle Component
const JobPostingTitle = () => (
  <section className="text-center my-4">
    <img
      loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/99fa6d6e32ae2151149cadf46ae321386503f8c8964c3d96e855dd827a59b853?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
      alt="Post job icon"
      className="mb-2"
      style={{ maxWidth: '40px' }}
    />
    <h2 className="h3">Post a Job</h2>
  </section>
);

// JobPostingStepper Component
const StepperItem = ({ imgSrc, stepNumber, title, isActive }) => (
  <div className={`d-flex align-items-center ${isActive ? 'text-primary' : ''}`}>
    <img loading="lazy" src={imgSrc} alt={`Step ${stepNumber} icon`} className="me-3" style={{ maxWidth: '30px' }} />
    <div>
      <div className="fw-bold">Step {stepNumber}</div>
      <div>{title}</div>
    </div>
  </div>
);

const JobPostingStepper = () => {
  const steps = [
    { imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/6a42fd1310401124f065989747c4a4f9f75a4e05167b241e82d076d6bb0a9963?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975", title: "Job Information", isActive: true },
    { imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/46c54760f1a99081a79cc0bf9bcef9fc0e5a10546bbbac656e7081a2d3814873?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975", title: "Job Description", isActive: false },
  ];

  return (
    <nav className="d-flex justify-content-between my-4">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <StepperItem
            imgSrc={step.imgSrc}
            stepNumber={index + 1}
            title={step.title}
            isActive={step.isActive}
          />
          {index < steps.length - 1 && <div className="mx-2 border-end" style={{ height: '2rem' }} />}
        </React.Fragment>
      ))}
    </nav>
  );
};

// JobInformationForm Component
const FormSection = ({ title, description, children }) => (
  <section className="mb-4">
    <h3 className="h5">{title}</h3>
    <p>{description}</p>
    <div>{children}</div>
  </section>
);

const InputField = ({ label, placeholder, helperText }) => (
  <div className="mb-3">
    <label htmlFor={label.toLowerCase()} className="form-label">{label}</label>
    <input
      type="text"
      id={label.toLowerCase()}
      className="form-control"
      placeholder={placeholder}
    />
    {helperText && <div className="form-text">{helperText}</div>}
  </div>
);

const CheckboxGroup = ({ options }) => (
  <div className="mb-3">
    {options.map((option, index) => (
      <div key={index} className="form-check">
        <input type="checkbox" id={option.toLowerCase()} className="form-check-input" />
        <label htmlFor={option.toLowerCase()} className="form-check-label">{option}</label>
      </div>
    ))}
  </div>
);

const SalaryRange = () => (
  <div className="mb-3">
    <div className="dropdown">
      <select id="Salary" className="form-select">
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
        className="position-absolute top-50 end-0 translate-middle-y me-2"
        style={{ maxWidth: '20px' }}
      />
    </div>
  </div>
);

const Dropdown = ({ placeholder }) => (
  <div className="mb-3">
    <div className="dropdown">
      <select id="industry" className="form-select">
        <option value="Select">{placeholder}</option>
      </select>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/42e47154ee484296a37ad9e22a695392014763876ec4f686befb2efd60116146?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
        alt="Dropdown arrow"
        className="position-absolute top-50 end-0 translate-middle-y me-2"
        style={{ maxWidth: '20px' }}
      />
    </div>
  </div>
);

const SkillTags = ({ placeholder }) => (
  <div className="mb-3">
    <div className="dropdown">
      <select id="Skills" className="form-select">
        <option value="">{placeholder}</option>
      </select>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/42e47154ee484296a37ad9e22a695392014763876ec4f686befb2efd60116146?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
        alt="Dropdown arrow"
        className="position-absolute top-50 end-0 translate-middle-y me-2"
        style={{ maxWidth: '20px' }}
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
    <form>
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
        <Dropdown placeholder="Select Industry" />
      </FormSection>

      <FormSection
        title="Required Skills"
        description="Add required skills for the job"
      >
        <SkillTags placeholder="Select Skills" />
      </FormSection>

      <button type="button" className="btn btn-primary" onClick={handleNextStep}>Next Step</button>
    </form>
  );
};

// JobPostingPage Component
const JobPostingPage = () => (
  <div className="container my-4">
    <div className="main-content">
      <JobPostingHeader companyName="Saint Anthony Montessori" jobTitle="Company" />
      <JobPostingTitle />
      <JobPostingStepper />
      <main>
        <JobInformationForm />
      </main>
    </div>
  </div>
);

export default JobPostingPage;

import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

// TopNav Component
function TopNav() {
  return (
    <header className="d-flex justify-content-between align-items-center p-3 border-bottom">
      <div className="d-flex align-items-center">
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/1d41edab7dfd7b603d5a4ad1ca09c3c8f114a2c36e787393ece6fc0064e84327?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
          alt="Company logo" 
          className="me-3" 
          style={{ maxWidth: '50px' }} 
        />
        <div>
          <p className="mb-0 fw-bold">Company</p>
          <h1 className="mb-0 d-flex align-items-center">
            Saint Anthony Montessori
            <img 
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/094d56e22dd1b07143c6e0b7804b4e8167234f7715ffe38b80659cd99184a939?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
              alt="Verified badge" 
              className="ms-2"
              style={{ maxWidth: '30px' }} 
            />
          </h1>
        </div>
      </div>
      <div className="d-flex align-items-center">
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/6dac324345bbc13698ac872cc77d9d263753bd48e8f7f2cbe129c409887b48dc?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
          alt="User profile" 
          className="me-3" 
          style={{ maxWidth: '40px', borderRadius: '50%' }} 
        />
        <button className="btn btn-primary d-flex align-items-center">
          <img 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/2e7d66b5d85410abffc25e2d6f30311bb55cb26c3092bd566c5f85092b3362d6?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
            alt="Post job icon" 
            className="me-2" 
            style={{ maxWidth: '20px' }} 
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
    navigate(-1); // Navigate back
  };

  return (
    <section className="d-flex align-items-center mb-4">
      <button className="btn btn-outline-secondary me-3" onClick={handleBack} aria-label="Go back">
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <h2 className="h4">Post a Job</h2>
    </section>
  );
}

// JobPostingStepper Component
const StepperItem = ({ imgSrc, stepNumber, title, isActive }) => (
  <div className={`d-flex align-items-center ${isActive ? 'text-primary' : ''}`}>
    <img loading="lazy" src={imgSrc} alt={`Step ${stepNumber} icon`} className="me-2" style={{ maxWidth: '30px' }} />
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

// TextAreaField Component
function TextAreaField({ label, description, placeholder }) {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className="mb-4">
      <div className="mb-2">
        <label htmlFor={`${label.toLowerCase()}Input`} className="form-label">{label}</label>
        <p>{description}</p>
      </div>
      <div>
        <textarea
          id={`${label.toLowerCase()}Input`}
          className="form-control"
          placeholder={placeholder}
          aria-label={label}
          value={value}
          onChange={handleChange}
          rows="4"
        />
        <div className="d-flex justify-content-between mt-2">
          {/* <div className="d-flex">
            {['bold', 'italic', 'underline', 'list', 'link', 'image'].map((tool) => (
              <button key={tool} type="button" className="btn btn-outline-secondary me-2" aria-label={`${tool} text`}>
                <img src={`http://b.io/ext_${tool}-`} alt={`${tool} icon`} style={{ maxWidth: '20px' }} />
              </button>
            ))}
          </div> */}
          <div className="text-end">
            <span className="d-block">Maximum 500 characters</span>
            <span>{value.length} / 500</span>
          </div>
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
    <form>
      <h2 className="h4 mb-3">Details</h2>
      <p className="mb-4">
        Add the description of the job, responsibilities, who you are, and nice-to-haves.
      </p>
      {formFields.map((field, index) => (
        <React.Fragment key={field.label}>
          <TextAreaField {...field} />
          {index < formFields.length - 1 && <hr className="my-4" />}
        </React.Fragment>
      ))}
    </form>
  );
}

// JobPostingPage Component
function JobPostingPage() {
  return (
    <main className="container my-4">
      <TopNav />
      <PostJobHeader />
      <JobPostingStepper />
      <JobDetailsForm />
      <button className="btn btn-primary mt-4">Post Job</button>
    </main>
  );
}

export default JobPostingPage;

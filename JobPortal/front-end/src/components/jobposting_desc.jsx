import React from "react";
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
  return (
    <section className={styles.postJobHeader}>
      <img 
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/1155aa9d23c1939bc102e4ce5a75c6147b88f99265e79406441c16c37f6591d3?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
        alt="Post job icon" 
        className={styles.postJobIcon} 
      />
      <h2 className={styles.postJobTitle}>Post a Job</h2>
    </section>
  );
}

// StepperItem Component
// StepperBar Component
function StepperItem() {
    const steps = [
      { number: 1, title: "Job Information", icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/37b91402d8e8dde307fc03722985cc6e677360c9c681eab95a3fc48f00f1bcbb?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975", active: true },
      { number: 2, title: "Job Description", icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/61115867073ca323e424379632faaf92b8156881755975ab487576ca98493573?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975", active: true },
      // Step 3 and beyond are removed or not rendered
    ];
  
    return (
      <nav className={styles.stepperBar}>
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {index > 0 && <div className={styles.divider} />}
            <StepperItem {...step} />
          </React.Fragment>
        ))}
      </nav>
    );
  }
  

// StepperBar Component
function StepperBar() {
  const steps = [
    { number: 1, title: "Job Information", icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/37b91402d8e8dde307fc03722985cc6e677360c9c681eab95a3fc48f00f1bcbb?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975", active: true },
    { number: 2, title: "Job Description", icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/61115867073ca323e424379632faaf92b8156881755975ab487576ca98493573?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975", active: true },
    { number: 3, title: "", icon: "", active: false }
  ];

  return (
    <nav className={styles.stepperBar}>
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          {index > 0 && <div className={styles.divider} />}
          <StepperItem {...step} />
        </React.Fragment>
      ))}
    </nav>
  );
}

// TextAreaField Component
function TextAreaField({ label, description, placeholder }) {
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
        />
        <div className={styles.textAreaTools}>
          {['bold', 'italic', 'underline', 'list', 'link', 'image'].map((tool) => (
            <button key={tool} type="button" className={styles.toolButton} aria-label={`${tool} text`}>
              <img src={`http://b.io/ext_${tool}-`} alt="" className={styles.toolIcon} />
            </button>
          ))}
        </div>
        <div className={styles.characterCount}>
          <span className={styles.maxCharacters}>Maximum 500 characters</span>
          <span className={styles.currentCount}>0 / 500</span>
        </div>
      </div>
    </div>
  );
}

// JobDetailsForm Component
function JobDetailsForm() {
  const formFields = [
    { label: "Job Descriptions", description: "Job titles must be describe one position", placeholder: "Enter job description" },
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
      <StepperBar />
      <JobDetailsForm />
      <button className={styles.nextStepButton}>Post Job</button>
    </main>
  );
}

export default JobPostingPage;

import React, { useState } from 'react';
import SubmitApplication from './jobseeker_submit';


const Header = () => {
  return (
    <header className="bg-transparent py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <img
            src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`}
            alt="TrabahaDoor logo"
            width="30"
            height="30"
            className="me-3"
          />
          <span className="fw-bold fs-4">TrabahaDoor</span>
        </div>
        <nav>
          <ul className="nav" style={{ width: '100%' }}>
            <li className="nav-item">
              <a href="#" className="nav-link active" style={{ fontSize: '1.25rem' }}>Find Jobs</a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link" style={{ fontSize: '1.25rem' }}>Browse Companies</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};


const ProgressBar = ({ current, total }) => {
  const percentage = (current / total) * 100;
  return (
    <div className="mb-4">
      <p>
        <strong>{current} applied</strong> of {total} capacity
      </p>
      <div className="progress">
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${percentage}%` }}
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  );
};


const Tag = ({ children, color = 'primary' }) => {
  return (
    <span className={`badge bg-${color} me-2`}>{children}</span>
  );
};


const Button = ({ children, variant = 'primary', onClick, ...props }) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};


const JobDetails = () => {
  const jobInfo = [
    { label: 'Job Posted On', value: 'April 1, 2024' },
    { label: 'Job Type', value: 'Full-Time' },
    { label: 'Salary', value: '20k-30k PHP' }
  ];
  const skills = ['Time Management', 'Writing', 'Communication', 'English', 'Teamwork'];


  return (
    <aside className="col-md-4">
      <section className="mb-4">
        <h2>About this role</h2>
        <ProgressBar current={5} total={10} />
        {jobInfo.map(({ label, value }) => (
          <div key={label} className="d-flex justify-content-between mb-2">
            <span>{label}</span>
            <span className="fw-bold">{value}</span>
          </div>
        ))}
      </section>
      <hr />
      <section className="mb-4">
        <h2>Categories</h2>
        <Tag color="secondary">Education</Tag>
      </section>
      <hr />
      <section>
        <h2>Required Skills</h2>
        <div className="d-flex flex-wrap">
          {skills.map((skill) => (
            <Tag key={skill}>{skill}</Tag>
          ))}
        </div>
      </section>
    </aside>
  );
};


const JobContent = () => {
  const responsibilities = [
    'Develop and implement lesson plans that meet the requirements of the curriculum',
    'Create a positive and inclusive classroom environment conducive to learning',
    'Deliver engaging and interactive lectures to students',
    'Assess student progress and provide constructive feedback',
    'Communicate regularly with parents to update them on their child\'s progress'
  ];
  const qualifications = [
    'Bachelor\'s degree in Education or related field (Master\'s degree preferred)',
    'Valid teaching license/certification',
    'Previous teaching experience preferred'
  ];


  return (
    <div className="col-md-8">
      <section className="mb-4">
        <h2>Description</h2>
        <p>
          We are seeking a dedicated and passionate teacher to join our team. The ideal candidate will be responsible for creating a positive learning environment, developing lesson plans, delivering engaging lectures, and assessing student progress. The teacher will also be responsible for fostering a supportive and inclusive classroom community.
        </p>
      </section>
      <section className="mb-4">
        <h2>Responsibilities</h2>
        <ul>
          {responsibilities.map((responsibility, index) => (
            <li key={index}>{responsibility}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Qualifications</h2>
        <ul>
          {qualifications.map((qualification, index) => (
            <li key={index}>{qualification}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};


const JobDescription = () => {
  const [isModalOpen, setModalOpen] = useState(false);


  return (
    <main className="container mt-3"> {/* Reduced top margin */}
      <Header />
      <hr />
      <section className="row mb-5">
        <div className="col-md-8 d-flex align-items-center">
          <img
            src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`}
            alt="Saint Anthony Montessori logo"
            width="100"
            height="100"
            className="me-4"
          />
          <div>
            <h1>Teacher - Primary Level</h1>
            <div className="d-flex flex-column">
              <span className="text-muted">Saint Anthony Montessori</span>
              <span>San Jose, Batangas</span>
              <span>Full-Time</span>
            </div>
          </div>
        </div>
        <div className="col-md-4 text-end">
          <SubmitApplication isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
        </div>
      </section>
      <section className="row">
        <JobContent />
        <JobDetails />
      </section>
    </main>
  );
};


export default JobDescription;

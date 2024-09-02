import React, { useState } from 'react';
import styles from '../css/jobdescription.module.css';
import SubmitApplication from './jobseeker_submit';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <nav className={styles.topNav}>
          <div className={styles.menu}>
            <div className={styles.logo}>
              <img src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`} alt="TrabahaDoor logo" className={styles.logoImage} />
              <span className={styles.logoText}>TrabahaDoor</span>
            </div>
            <ul className={styles.menuItems}>
              <li className={styles.menuItem}>
                <a href="#" className={styles.activeLink}>Find Jobs</a>
              </li>
              <li className={styles.menuItem}>
                <a href="#">Browse Companies</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

const ProgressBar = ({ current, total }) => {
  const percentage = (current / total) * 100;
  return (
    <div className={styles.progressBar}>
      <p className={styles.progressText}>
        <span className={styles.progressHighlight}>{current} applied</span> of {total} capacity
      </p>
      <div className={styles.progressBarContainer}>
        <div className={styles.progressFill} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

const Tag = ({ children, color = 'primary' }) => {
  return (
    <span className={`${styles.tag} ${styles[color]}`}>
      {children}
    </span>
  );
};

const Button = ({ children, variant = 'primary', onClick, className, ...props }) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${className}`}
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
    <aside className={styles.jobDetails}>
      <section className={styles.aboutRole}>
        <h2 className={styles.sectionTitle}>About this role</h2>
        <ProgressBar current={5} total={10} />
        {jobInfo.map(({ label, value }) => (
          <div key={label} className={styles.jobInfo}>
            <span className={styles.jobInfoLabel}>{label}</span>
            <span className={styles.jobInfoValue}>{value}</span>
          </div>
        ))}
      </section>
      <hr className={styles.divider} />
      <section className={styles.categories}>
        <h2 className={styles.sectionTitle}>Categories</h2>
        <Tag color="secondary">Education</Tag>
      </section>
      <hr className={styles.divider} />
      <section className={styles.requiredSkills}>
        <h2 className={styles.sectionTitle}>Required Skills</h2>
        <div className={styles.skillTags}>
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
    <div className={styles.jobContent}>
      <section className={styles.jobDescription}>
        <h2>Description</h2>
        <p>
          We are seeking a dedicated and passionate teacher to join our team. The ideal candidate will be responsible for creating a positive learning environment, developing lesson plans, delivering engaging lectures, and assessing student progress. The teacher will also be responsible for fostering a supportive and inclusive classroom community.
        </p>
      </section>
      <section className={styles.responsibilities}>
        <h2>Responsibilities</h2>
        <ul>
          {responsibilities.map((responsibility, index) => (
            <li key={index}>{responsibility}</li>
          ))}
        </ul>
      </section>
      <section className={styles.qualifications}>
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
    <main className={styles.jobDescription}>
      <Header />
      <hr className={styles.divider} />
      <section className={styles.jobInfor}>
        <img src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`} alt="Saint Anthony Montessori logo" className={styles.companyLogo} />
        <div>
          <h1 className={styles.jobTitle}>Teacher - Primary Level</h1>
          <div className={styles.jobMeta}>
            <span className={styles.companyName}>Saint Anthony Montessori</span>
            <span className={styles.location}>San Jose, Batangas</span>
            <span className={styles.jobType}>Full-Time</span>
          </div>
        </div>
        <div className={styles.actionButtons}>
          <SubmitApplication isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
        </div>
      </section>
      <section className={styles.contentSection}>
        <div className={styles.contentWrapper}>
          <JobContent />
          <JobDetails />
        </div>
      </section>
    </main>
  );
};

export default JobDescription;

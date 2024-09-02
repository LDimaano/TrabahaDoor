import React, { useState } from 'react';
import styles from '../css/jobdescription.module.css';
import SubmitApplication from './jobseeker_submit';

const JobDescription = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navbarContent}>
          <div className={styles.logo}>
            <img
              src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`}
              alt="TrabahaDoor Logo"
              className={styles.logoImage}
            />
            <span className={styles.logoText}>TrabahaDoor</span>
          </div>
          <ul className={styles.navMenu}>
            <li className={styles.navItem}>
              <a href="#" className={styles.navLink}>Find Jobs</a>
              <div className={styles.activeIndicator} />
            </li>
            <li className={styles.navItem}>
              <a href="#" className={styles.navLink}>Browse Companies</a>
            </li>
          </ul>
        </div>
      </nav>

      <main className={styles.jobDescription}>
        <section className={styles.contentWrapper}>
          <section className={styles.jobDetails}>
            <div className={styles.jobHeader}>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/2e5a52057d966b843a80c339e712957432a6b7a3436d51c05a583a10b4f9d2d8?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae"
                alt="Saint Anthony Montessori Logo"
                className={styles.companyLogo}
              />
              <div className={styles.jobInfo}>
                <h1 className={styles.jobTitle}>Teacher - Primary Level</h1>
                <div className={styles.jobMeta}>
                  <span className={styles.companyName}>Saint Anthony Montessori</span>
                  <span className={styles.location}>San Jose, Batangas</span>
                  <span className={styles.jobType}>Full-Time</span>
                </div>
              </div>
            </div>
            <div className={styles.actionArea}>
              <button className={styles.saveButton} aria-label="Save Job">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/50b2ad72e3d1b912bbd6767bf31d8301f31d87db27713920a2691bf98853d6b4?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae"
                  alt=""
                  className={styles.saveIcon}
                />
              </button>
              <SubmitApplication isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
            </div>
          </section>
          <div className={styles.jobContent}>
            <div className={styles.mainContent}>
              <section className={styles.jobDescriptionSection}>
                <h2 className={styles.sectionTitle}>Description</h2>
                <p className={styles.descriptionText}>
                  We are seeking a dedicated and passionate teacher to join our team. The ideal candidate will be responsible for creating a positive learning environment, developing lesson plans, delivering engaging lectures, and assessing student progress. The teacher will also be responsible for fostering a supportive and inclusive classroom community.
                </p>
              </section>
              <section className={styles.jobRequirements}>
                <div className={styles.responsibilities}>
                  <h2 className={styles.sectionTitle}>Responsibilities</h2>
                  <ul className={styles.requirementsList}>
                    {[
                      "Develop and implement lesson plans that meet the requirements of the curriculum",
                      "Create a positive and inclusive classroom environment conducive to learning",
                      "Deliver engaging and interactive lectures to students",
                      "Assess student progress and provide constructive feedback",
                      "Communicate regularly with parents to update them on their child's progress"
                    ].map((item, index) => (
                      <li key={index} className={styles.requirementItem}>
                        <img
                          src={`${process.env.PUBLIC_URL}/assets/bullet.png`}
                          alt="bullet"
                          className={styles.bulletIcon}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles.qualifications}>
                  <h2 className={styles.sectionTitle}>Qualifications</h2>
                  <ul className={styles.requirementsList}>
                    {[
                      "Bachelor's degree in Education or related field (Master's degree preferred)",
                      "Valid teaching license/certification",
                      "Previous teaching experience preferred"
                    ].map((item, index) => (
                      <li key={index} className={styles.requirementItem}>
                        <img
                          src={`${process.env.PUBLIC_URL}/assets/bullet.png`}
                          alt="bullet"
                          className={styles.bulletIcon}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>
            <aside className={styles.jobSidebar}>
              <section className={styles.aboutRole}>
                <h2 className={styles.sectionTitle}>About this role</h2>
                <div className={styles.progressBar}>
                  <p className={styles.progressText}>
                    <span className={styles.appliedCount}>5 applied</span> of 10 capacity
                  </p>
                  <div className={styles.progressTrack}>
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className={`${styles.progressSegment} ${index < 2 ? styles.filled : ''}`} />
                    ))}
                  </div>
                </div>
                {[
                  { label: "Job Posted On", value: "April 1, 2024" },
                  { label: "Job Type", value: "Full-Time" },
                  { label: "Salary", value: "20k-30k PHP" }
                ].map(({ label, value }, index) => (
                  <div key={index} className={styles.jobDetail}>
                    <span className={styles.detailLabel}>{label}</span>
                    <span className={styles.detailValue}>{value}</span>
                  </div>
                ))}
              </section>
              <hr className={styles.divider} />
              <section className={styles.categories}>
                <h2 className={styles.sectionTitle}>Categories</h2>
                <span className={styles.categoryTag}>Education</span>
              </section>
              <hr className={styles.divider} />
              <section className={styles.requiredSkills}>
                <h2 className={styles.sectionTitle}>Required Skills</h2>
                <div className={styles.skillTags}>
                  {["Time Management", "Writing", "Communication", "English", "Teamwork"].map((skill, index) => (
                    <span key={index} className={styles.skillTag}>{skill}</span>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
};

export default JobDescription;

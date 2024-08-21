import React, { useState } from 'react';
import '../css/jobdescription.css';
import SubmitApplication from './jobseeker_submit';

const JobDescription = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <><nav className="navbar">
      <div className="navbarContent">
        <div className="logo">
          <img
            src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`}
            alt="TrabahaDoor Logo"
            className="logoImage" />
          <span className="logoText">TrabahaDoor</span>
        </div>
        <ul className="navMenu">
          <li className="navItem">
            <a href="#" className="navLink">Find Jobs</a>
            <div className="activeIndicator" />
          </li>
          <li className="navItem">
            <a href="#" className="navLink">Browse Companies</a>
          </li>
        </ul>
        <div className="authButtons">
          <button className="loginButton">Login</button>
          <div className="buttonDivider" />
          <button className="signupButton">Sign Up</button>
        </div>
      </div>
    </nav>
    <main className="jobDescription">
        <section className="contentWrapper">
          <section className="jobDetails">
            <div className="jobHeader">
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/2e5a52057d966b843a80c339e712957432a6b7a3436d51c05a583a10b4f9d2d8?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" alt="Saint Anthony Montessori Logo" className="companyLogo" />
              <div className="jobInfo">
                <h1 className="jobTitle">Teacher - Primary Level</h1>
                <div className="jobMeta">
                  <span className="companyName">Saint Anthony Montessori</span>
                  <span className="location">San Jose, Batangas</span>
                  <span className="jobType">Full-Time</span>
                </div>
              </div>
            </div>
            <div className="actionArea">
              <button className="saveButton" aria-label="Save Job">
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/50b2ad72e3d1b912bbd6767bf31d8301f31d87db27713920a2691bf98853d6b4?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" alt="" className="saveIcon" />
              </button>
              <SubmitApplication isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
            </div>
          </section>
          <div className="jobContent">
            <div className="mainContent">
              <section className="jobDescription">
                <h2 className="sectionTitle">Description</h2>
                <p className="descriptionText">
                  We are seeking a dedicated and passionate teacher to join our team. The ideal candidate will be responsible for creating a positive learning environment, developing lesson plans, delivering engaging lectures, and assessing student progress. The teacher will also be responsible for fostering a supportive and inclusive classroom community.
                </p>
              </section>
              <section className="jobRequirements">
                <div className="responsibilities">
                  <h2 className="sectionTitle">Responsibilities</h2>
                  <ul className="requirementsList">
                    {[
                      "Develop and implement lesson plans that meet the requirements of the curriculum",
                      "Create a positive and inclusive classroom environment conducive to learning",
                      "Deliver engaging and interactive lectures to students",
                      "Assess student progress and provide constructive feedback",
                      "Communicate regularly with parents to update them on their child's progress"
                    ].map((item, index) => (
                      <li key={index} className="requirementItem">
                        <img src={`${process.env.PUBLIC_URL}/assets/bullet.png`} alt="bullet" className="bulletIcon" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="qualifications">
                  <h2 className="sectionTitle">Qualifications</h2>
                  <ul className="requirementsList">
                    {[
                      "Bachelor's degree in Education or related field (Master's degree preferred)",
                      "Valid teaching license/certification",
                      "Previous teaching experience preferred"
                    ].map((item, index) => (
                      <li key={index} className="requirementItem">
                        <img src={`${process.env.PUBLIC_URL}/assets/bullet.png`} alt="bullet" className="bulletIcon" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>
            <aside className="jobSidebar">
              <section className="aboutRole">
                <h2 className="sectionTitle">About this role</h2>
                <div className="progressBar">
                  <p className="progressText">
                    <span className="appliedCount">5 applied</span> of 10 capacity
                  </p>
                  <div className="progressTrack">
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className={`progressSegment ${index < 2 ? 'filled' : ''}`} />
                    ))}
                  </div>
                </div>
                {[
                  { label: "Job Posted On", value: "April 1, 2024" },
                  { label: "Job Type", value: "Full-Time" },
                  { label: "Salary", value: "20k-30k PHP" }
                ].map(({ label, value }, index) => (
                  <div key={index} className="jobDetail">
                    <span className="detailLabel">{label}</span>
                    <span className="detailValue">{value}</span>
                  </div>
                ))}
              </section>
              <hr className="divider" />
              <section className="categories">
                <h2 className="sectionTitle">Categories</h2>
                <span className="categoryTag">Education</span>
              </section>
              <hr className="divider" />
              <section className="requiredSkills">
                <h2 className="sectionTitle">Required Skills</h2>
                <div className="skillTags">
                  {["Time Management", "Writing", "Communication", "English", "Teamwork"].map((skill, index) => (
                    <span key={index} className="skillTag">{skill}</span>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </section>
      </main></>
  );
};

export default JobDescription;

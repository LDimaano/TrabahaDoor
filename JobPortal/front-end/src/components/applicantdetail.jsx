import React from 'react';
import styles from '../css/applicantdetails.module.css';

const SideBar = () => {
  const menuItems = [
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/d7f977ef9a542ad6fafe41effa9b890685e27bcbabfc1d641a0d7982e265301c?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae", caption: "Profile" },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/195c685cada84b34597812172fb4160469cf06506d209379aae2a99d69254fb6?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae", caption: "All Applicants", active: true },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/bd57e45babd7606693a30546b4ae839b2d6bba1c01c5dcbfc0f9d1b1cd185319?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae", caption: "Job Listing" },
  ];

  return (
    <aside className={styles.sideBar}>
      <header className={styles.logoContainer}>
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/77d8f70ad753682ed3c08cf420578db1e07c413fc92448745834313fecb2786c?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" alt="TrabahaDoor Logo" className={styles.logo} />
        <h1 className={styles.brandName}>TrabahaDoor</h1>
      </header>
      <nav className={styles.menu}>
        {menuItems.map((item, index) => (
          <MenuItem key={index} {...item} />
        ))}
      </nav>
      <div className={styles.divider} />
      <ProfileSection />
    </aside>
  );
};

const MenuItem = ({ icon, caption, active }) => (
  <div className={`${styles.menuItem} ${active ? styles.activeMenuItem : ''}`}>
    <img src={icon} alt={`${caption} icon`} className={styles.menuIcon} />
    <span className={styles.menuCaption}>{caption}</span>
    {active && <div className={styles.activeIndicator} />}
  </div>
);

const ProfileSection = () => (
  <div className={styles.profileSection}>
    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/da3d0235597bb0ece042c8c8d218f9289edfd7ecbd94200e3cea15431f72a875?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" alt="User profile" className={styles.profileImage} />
    <div className={styles.profileInfo}>
      <span className={styles.userName}>Maria Kelly</span>
      <span className={styles.userEmail}>MariaKlly@email.com</span>
    </div>
  </div>
);

const TopNav = () => (
  <header className={styles.topNav}>
    <div className={styles.companyInfo}>
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/0ba9e195b18ac61f1b4efa4e6d4992f6e07b13919e54734c3ab56b46266c06e2?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" alt="Company logo" className={styles.companyLogo} />
      <div className={styles.companyDetails}>
        <span className={styles.companyLabel}>Company</span>
        <h2 className={styles.companyName}>
          Saint Anthony Montessori
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/11e2517998516c181ac04025690221ae22f5c4e4eb4dee7f65d6fdbaf2f88a9b?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" alt="Verified" className={styles.verifiedIcon} />
        </h2>
      </div>
    </div>
    <div className={styles.actionButtons}>
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/e21b78a18fc145e5107085949b30d159d0cb4a75b08a8bd45b390168709672cb?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" alt="Notifications" className={styles.notificationIcon} />
      <button className={styles.postJobButton}>
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/8ace288be83ff5c7c4ccfb980d8ab4f5d004c20e952ea0efbd4fec5363689c97?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" alt="" className={styles.postJobIcon} />
        <span>Post a job</span>
      </button>
    </div>
  </header>
);

const ApplicantDetails = () => (
  <section className={styles.applicantDetails}>
    <header className={styles.applicantHeader}>
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/df32c6323ec0c4c3bc4a360d2a3edddfaf0577b4ada639bf9e465b3adfbf1815?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" alt="Applicant icon" className={styles.applicantIcon} />
      <h2 className={styles.applicantTitle}>Applicant Details</h2>
    </header>
    <button className={styles.moreActionButton}>
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/969a6a3b3f80237d17ff50d537090cb453a1a1e29b19bab533bf8885d44e86ed?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" alt="" className={styles.moreActionIcon} />
      <span>More Action</span>
    </button>
  </section>
);

const ApplicantProfile = () => (
  <main className={styles.applicantProfile}>
    <nav className={styles.profileTabs}>
      <button className={`${styles.tabButton} ${styles.activeTab}`}>Applicant Profile</button>
    </nav>
    <div className={styles.profileContent}>
      <PersonalInfo />
      <hr className={styles.sectionDivider} />
      <ProfessionalInfo />
    </div>
  </main>
);

const PersonalInfo = () => (
  <section className={styles.personalInfo}>
    <h3 className={styles.sectionTitle}>Personal Info</h3>
    <div className={styles.infoGrid}>
      <InfoItem label="Full Name" value="Jerome Bell" />
      <InfoItem label="Date of Birth" value="March 23, 1995 (26 y.o)" />
      <InfoItem label="Gender" value="Male" />
      <InfoItem label="Address" value="Brgy. Abra, San Jose, Batangas" />
    </div>
  </section>
);

const ProfessionalInfo = () => (
  <section className={styles.professionalInfo}>
    <h3 className={styles.sectionTitle}>Professional Info</h3>
    <div className={styles.aboutMe}>
      <h4 className={styles.subsectionTitle}>About Me</h4>
      <p className={styles.aboutMeContent}>
        As an elementary teacher, I believe in fostering a love for learning and helping each student reach their full potential. I am dedicated to creating a classroom community where every student feels valued, supported, and inspired to learn. I believe that education is a partnership between teachers, students, and parents, and I look forward to working together to help your child succeed.
      </p>
    </div>
    <div className={styles.infoGrid}>
      <InfoItem label="Current Job" value="Elementary Teacher" />
      <InfoItem label="Work Experience" value="4 Years" />
      <SkillSet />
    </div>
  </section>
);

const InfoItem = ({ label, value }) => (
  <div className={styles.infoItem}>
    <span className={styles.infoLabel}>{label}</span>
    <span className={styles.infoValue}>{value}</span>
  </div>
);

const SkillSet = () => (
  <div className={styles.skillSet}>
    <span className={styles.infoLabel}>Skill set</span>
    <div className={styles.skillTags}>
      {['English', 'Leadership', 'Teamwork'].map((skill, index) => (
        <span key={index} className={styles.skillTag}>{skill}</span>
      ))}
    </div>
  </div>
);

const ApplicantCard = () => (
  <aside className={styles.applicantCard}>
    <header className={styles.cardHeader}>
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/3abeed5f2de2d8df2f096ae96cc50be8ac71d626c31b3c38ffa0141113466826?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" alt="Jerome Bell" className={styles.applicantImage} />
      <div className={styles.applicantInfo}>
        <h2 className={styles.applicantName}>Jerome Bell</h2>
        <p className={styles.applicantRole}>Elementary Teacher</p>
      </div>
    </header>
    <hr className={styles.cardDivider} />
    <section className={styles.contactInfo}>
      <h3 className={styles.contactTitle}>Contact</h3>
      <ContactItem icon="https://cdn.builder.io/api/v1/image/assets/TEMP/ab6f587dcea2feb8ba196239d2dbe8089ac193e55c6dbdc38125a77d9ca35531?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" label="Email" value="jeromeBell45@email.com" />
      <ContactItem icon="https://cdn.builder.io/api/v1/image/assets/TEMP/8a17b7430f0018cf8821e9bdc668301aa5af2da139f8bfe7a795d7573d9f0082?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" label="Phone" value="+63 956 812 4293" />
    </section>
  </aside>
);

const ContactItem = ({ icon, label, value }) => (
  <div className={styles.contactItem}>
    <img src={icon} alt="" className={styles.contactIcon} />
    <div className={styles.contactDetails}>
      <span className={styles.contactLabel}>{label}</span>
      <span className={styles.contactValue}>{value}</span>
    </div>
  </div>
);

const CompanyDashboard = () => (
  <div className={styles.dashboardContainer}>
    <SideBar />
    <div className={styles.mainContent}>
      <TopNav />
      <ApplicantDetails />
      <div className={styles.applicantSection}>
        <ApplicantProfile />
        <ApplicantCard />
      </div>
    </div>
  </div>
);

export default CompanyDashboard;
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const SideBar = () => {
  const menuItems = [
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/d7f977ef9a542ad6fafe41effa9b890685e27bcbabfc1d641a0d7982e265301c?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae", caption: "Profile" },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/195c685cada84b34597812172fb4160469cf06506d209379aae2a99d69254fb6?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae", caption: "All Applicants", active: true },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/bd57e45babd7606693a30546b4ae839b2d6bba1c01c5dcbfc0f9d1b1cd185319?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae", caption: "Job Listing" },
  ];

  return (
    <aside className="d-flex flex-column bg-light p-3" style={{ width: '250px' }}>
      <header className="d-flex align-items-center mb-4">
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/77d8f70ad753682ed3c08cf420578db1e07c413fc92448745834313fecb2786c?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" alt="TrabahaDoor Logo" className="me-2" style={{ width: '50px' }} />
        <h1 className="fs-5">TrabahaDoor</h1>
      </header>
      <nav>
        {menuItems.map((item, index) => (
          <MenuItem key={index} {...item} />
        ))}
      </nav>
      <hr className="my-4" />
      <ProfileSection />
    </aside>
  );
};

const MenuItem = ({ icon, caption, active }) => (
  <div className={`d-flex align-items-center p-2 rounded ${active ? 'bg-primary text-white' : 'text-dark'}`}>
    <img src={icon} alt={`${caption} icon`} className="me-2" style={{ width: '24px' }} />
    <span>{caption}</span>
  </div>
);

const ProfileSection = () => (
  <div className="d-flex align-items-center mt-4">
    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/da3d0235597bb0ece042c8c8d218f9289edfd7ecbd94200e3cea15431f72a875?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" alt="User profile" className="me-2" style={{ width: '50px', borderRadius: '50%' }} />
    <div>
      <span className="d-block fw-bold">Maria Kelly</span>
      <span className="text-muted">MariaKlly@email.com</span>
    </div>
  </div>
);

const TopNav = () => (
  <header className="d-flex justify-content-between align-items-center bg-white border-bottom p-3">
    <div className="d-flex align-items-center">
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/0ba9e195b18ac61f1b4efa4e6d4992f6e07b13919e54734c3ab56b46266c06e2?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" alt="Company logo" className="me-2" style={{ width: '50px' }} />
      <div>
        <span className="d-block text-muted">Company</span>
        <h2 className="d-flex align-items-center mb-0">
          Saint Anthony Montessori
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/11e2517998516c181ac04025690221ae22f5c4e4eb4dee7f65d6fdbaf2f88a9b?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" alt="Verified" className="ms-2" style={{ width: '20px' }} />
        </h2>
      </div>
    </div>
    <div>
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/e21b78a18fc145e5107085949b30d159d0cb4a75b08a8bd45b390168709672cb?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" alt="Notifications" className="me-2" style={{ width: '24px' }} />
      <button className="btn btn-primary d-flex align-items-center">
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/8ace288be83ff5c7c4ccfb980d8ab4f5d004c20e952ea0efbd4fec5363689c97?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" alt="Post a job" className="me-2" style={{ width: '24px' }} />
        <span>Post a job</span>
      </button>
    </div>
  </header>
);

const ApplicantDetails = () => (
  <section className="bg-light p-4 mb-4">
    <header className="d-flex align-items-center mb-3">
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/df32c6323ec0c4c3bc4a360d2a3edddfaf0577b4ada639bf9e465b3adfbf1815?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" alt="Applicant icon" className="me-2" style={{ width: '24px' }} />
      <h2 className="mb-0">Applicant Details</h2>
    </header>
    <button className="btn btn-outline-secondary d-flex align-items-center">
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/969a6a3b3f80237d17ff50d537090cb453a1a1e29b19bab533bf8885d44e86ed?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" alt="More Action" className="me-2" style={{ width: '24px' }} />
      <span>More Action</span>
    </button>
  </section>
);

const ApplicantProfile = () => (
  <main className="bg-white p-4 border rounded">
    <nav className="d-flex mb-3">
      <button className="btn btn-link fw-bold active">Applicant Profile</button>
    </nav>
    <div>
      <PersonalInfo />
      <hr />
      <ProfessionalInfo />
    </div>
  </main>
);

const PersonalInfo = () => (
  <section>
    <h3>Personal Info</h3>
    <div className="row">
      <InfoItem label="Full Name" value="Jerome Bell" />
      <InfoItem label="Date of Birth" value="March 23, 1995 (26 y.o)" />
      <InfoItem label="Gender" value="Male" />
      <InfoItem label="Address" value="Brgy. Abra, San Jose, Batangas" />
    </div>
  </section>
);

const ProfessionalInfo = () => (
  <section>
    <h3>Professional Info</h3>
    <div className="mb-3">
      <h4>About Me</h4>
      <p>
        As an elementary teacher, I believe in fostering a love for learning and helping each student reach their full potential. I am dedicated to creating a classroom community where every student feels valued, supported, and inspired to learn. I believe that education is a partnership between teachers, students, and parents, and I look forward to working together to help your child succeed.
      </p>
    </div>
    <div className="row">
      <InfoItem label="Current Job" value="Elementary Teacher" />
      <InfoItem label="Work Experience" value="4 Years" />
      <SkillSet />
    </div>
  </section>
);

const InfoItem = ({ label, value }) => (
  <div className="col-md-6 mb-2">
    <span className="fw-bold">{label}:</span> {value}
  </div>
);

const SkillSet = () => (
  <div className="col-md-12">
    <span className="fw-bold">Skill set:</span>
    <div className="d-flex flex-wrap">
      {['English', 'Leadership', 'Teamwork'].map((skill, index) => (
        <span key={index} className="badge bg-primary text-white me-2 mb-2">{skill}</span>
      ))}
    </div>
  </div>
);

const ApplicantCard = () => (
  <aside className="bg-white p-4 border rounded">
    <header className="d-flex align-items-center mb-3">
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/3abeed5f2de2d8df2f096ae96cc50be8ac71d626c31b3c38ffa0141113466826?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" alt="Jerome Bell" className="me-3" style={{ width: '100px', borderRadius: '50%' }} />
      <div>
        <h2 className="mb-0">Jerome Bell</h2>
        <p className="text-muted">Elementary Teacher</p>
      </div>
    </header>
    <hr />
    <section>
      <h3>Contact</h3>
      <ContactItem icon="https://cdn.builder.io/api/v1/image/assets/TEMP/ab6f587dcea2feb8ba196239d2dbe8089ac193e55c6dbdc38125a77d9ca35531?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" label="Email" value="jeromeBell45@email.com" />
      <ContactItem icon="https://cdn.builder.io/api/v1/image/assets/TEMP/8a17b7430f0018cf8821e9bdc668301aa5af2da139f8bfe7a795d7573d9f0082?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" label="Phone" value="+63 956 812 4293" />
    </section>
  </aside>
);

const ContactItem = ({ icon, label, value }) => (
  <div className="d-flex align-items-center mb-2">
    <img src={icon} alt="" className="me-2" style={{ width: '24px' }} />
    <div>
      <span className="fw-bold">{label}:</span> {value}
    </div>
  </div>
);

const CompanyDashboard = () => (
  <div className="d-flex">
    <SideBar />
    <div className="flex-fill p-4">
      <TopNav />
      <ApplicantDetails />
      <div className="d-flex">
        <div className="flex-fill me-4">
          <ApplicantProfile />
        </div>
        <ApplicantCard />
      </div>
    </div>
  </div>
);

export default CompanyDashboard;

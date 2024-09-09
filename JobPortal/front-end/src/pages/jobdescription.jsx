import React, { useState } from 'react';
import Header from '../components/jsheader';
import JobContent from '../components/jobcontent';
import JobDetails from '../components/jobdetails';
import SubmitApplication from '../pages/jobseeker_submit';

const JobDescription = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <main className="container mt-3">
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

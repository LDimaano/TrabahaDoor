import React, { useState } from 'react';
import FormField from '../components/formfield';
import JobHeader from '../components/submitheader';
import AdditionalInfo from '../components/jssubmitaddinfo';
import Modal from '../components/modal';

const SubmitApplication = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const modalContent = (
    <div className="container">
      <section className="mb-4">
        <JobHeader
          logo="https://cdn.builder.io/api/v1/image/assets/TEMP/4510ed17dfd1da1e2f074cd5249c6b7e6c149301121221461cda3b29e3cb81e3?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae"
          title="Teacher - Primary Level"
          company="Saint Anthony Montessori"
          location="San Jose, Batangas"
          jobType="Full-Time"
        />
        <hr />
        <div className="mb-4 text-start">
          <h2 className="h4">Submit your application</h2>
          <p>The following is required and will only be shared with Nomad</p>
        </div>
        <form>
          <FormField label="Full name" type="text" placeholder="Enter your fullname" id="fullName" />
          <FormField label="Email address" type="email" placeholder="Enter your email address" id="email" />
          <FormField label="Phone number" type="tel" placeholder="Enter your phone number" id="phone" />
          <hr />
          <AdditionalInfo />
          <hr />
          <button type="submit" className="btn btn-primary">Submit Application</button>
          <p className="mt-3 text-start">
            By sending the request you can confirm that you accept our{" "}
            <a href="#terms" className="link-primary">Terms of Service</a> and{" "}
            <a href="#privacy" className="link-primary">Privacy Policy</a>
          </p>
        </form>
      </section>
    </div>
  );

  return (
    <>
      <button onClick={openModal} className="btn btn-primary">Apply Now</button>
      <Modal isOpen={isModalOpen} onClose={closeModal} content={modalContent} />
    </>
  );
};

export default SubmitApplication;

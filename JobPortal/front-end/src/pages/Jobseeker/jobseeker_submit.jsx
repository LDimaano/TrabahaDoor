import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FormField from '../../components/formfield';
import JobHeader from '../../components/submitheader';
import AdditionalInfo from '../../components/jssubmitaddinfo';
import Modal from '../../components/modal';

const SubmitApplication = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobDetails, setJobDetails] = useState({});
  const { jobId } = useParams(); // Get jobId from the URL

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Fetch job details when the component mounts
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/joblistings/${jobId}`);
        const data = await response.json();
        setJobDetails(data); // Set fetched job details to state
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };

    if (jobId) {
      fetchJobDetails(); // Trigger the fetch if jobId is available
    }
  }, [jobId]);

  const modalContent = (
    <div className="container">
      <section className="mb-4">
        {/* Dynamically populate job details from fetched jobDetails */}
        <JobHeader
          logo={jobDetails.logo || 'default-logo-url'} // Placeholder for a logo if not provided
          title={jobDetails.job_title || 'Job Title'}  // job_title from API
          company={jobDetails.company_name || 'Company Name'} // company_name from API
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

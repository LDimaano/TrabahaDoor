import React from 'react';
import JobPostingHeader from '../components/jobpostingheader';
import JobPostingTitle from '../components/jobpostingtitle';
import JobPostingStepper from '../components/jobpostingstepper';
import JobInformationForm from '../components/jobinformationform';
import 'bootstrap/dist/css/bootstrap.min.css';

const JobPostingPage = () => (
  <div>
    <JobPostingHeader companyName="Builder.io" jobTitle="Job Posting" />
    <JobPostingTitle />
    <JobPostingStepper />
    <JobInformationForm />
  </div>
);

export default JobPostingPage;

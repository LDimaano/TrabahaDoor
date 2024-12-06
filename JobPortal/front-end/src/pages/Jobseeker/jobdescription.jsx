import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/jsheader';
import JobContent from '../../components/jobcontent';
import JobDetails from '../../components/jobdetails';
import SubmitApplication from './jobseeker_submit';

const JobDescription = () => {
  const { jobId } = useParams();
  const [isModalOpen, setModalOpen] = useState(false);
  const [jobData, setJobData] = useState(null);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobs/joblistings/${jobId}`);
        const data = await response.json();
        setJobData(data);
      } catch (error) {
        console.error('Error fetching job data:', error);
      }
    };

    fetchJobData();
  }, [jobId]);

  if (!jobData) return <div>Loading...</div>;

  return (
    <main className="container mt-3">
      <Header />
      <hr />
      <section className="row mb-5">
        <div className="col-md-8 d-flex align-items-center">
          <img
            src={jobData.profile_picture_url}
            alt={`${jobData.company_name} logo`}
            width="100"
            height="100"
            className="me-4"
          />
          <div>
            <h1>{jobData.job_title}</h1>
            <div className="d-flex flex-column">
              <span className="text-muted">{jobData.company_name} - {jobData.website}</span>
            </div>
          </div>
        </div>
        <div className="col-md-4 text-end">
          <SubmitApplication isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
        </div>
      </section>
      <section className="row">
        <JobContent
          jobdescription={jobData.jobdescription}
          responsibilities={jobData.responsibilities ? jobData.responsibilities.split(',') : []}
          qualifications={jobData.qualifications ? jobData.qualifications.split(',') : []}
          educations={jobData.educations || []}    
        />
        <JobDetails
          jobInfo={[
            { label: 'Job Posted On', value: new Date(jobData.datecreated).toLocaleDateString() },
            { label: 'Job Type', value: jobData.jobtype },
            { label: 'Salary', value: jobData.salaryrange },
            { label: 'Available Positions', value: jobData.positions}
          ]}
          skills={jobData.skills || []} 
        />
      </section>
    </main>
  );
};

export default JobDescription;
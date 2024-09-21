import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import JobContent from '../../components/jobcontent';
import JobDetails from '../../components/jobdetails';
import Sidebar from '../../components/admin_sidepanel';

const JobDescription = () => {
  const navigate = useNavigate(); 
  const { jobId } = useParams();
  const [jobData, setJobData] = useState(null);

  const handleBack = () => {
    navigate(-1); 
  };

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/joblistings/${jobId}`);
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
    <div className="d-flex">
      <Sidebar />
    <main className="container mt-3">
      <section className="row mb-5">
        <div className="col-md-8 d-flex align-items-center">
        <button
                className="btn p-0 me-3"
                onClick={handleBack}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#000', 
                  fontSize: '1.5rem', 
                  cursor: 'pointer',
                }}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
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
              <span className="text-muted">{jobData.company_name}</span>
              <span>{jobData.industry}</span>
              <span>{jobData.job_type}</span>
            </div>
          </div>
        </div>
        <div className="col-md-4 text-end">
        </div>
      </section>
      <section className="row">
        <JobContent
          jobdescription={jobData.jobdescription}
          responsibilities={jobData.responsibilities ? jobData.responsibilities.split(',') : []}
          qualifications={jobData.qualifications ? jobData.qualifications.split(',') : []}
        />
        <JobDetails
          jobInfo={[
            { label: 'Job Posted On', value: new Date(jobData.datecreated).toLocaleDateString() },
            { label: 'Job Type', value: jobData.jobtype },
            { label: 'Salary', value: jobData.salaryrange }
          ]}
          skills={jobData.skills || []} 
        />
      </section>
    </main>
  </div>
  );
};

export default JobDescription;
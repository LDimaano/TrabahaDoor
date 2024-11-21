import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/emp_header';
import JobContent from '../../components/jobcontent';
import JobDetails from '../../components/jobdetails';
import Sidebar from '../../components/emp_side';

const JobDescription = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [jobData, setJobData] = useState(null);

  const handleBack = () => {
    navigate(-1);
  };

  const handleUpdateClick = () => {
    navigate(`/jobpostingupdate/${jobData.job_id}`);
  };

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
    <div className="d-flex">
      <Helmet>
        <title>TrabahaDoor - Employer</title> {/* Set the page title */}
      </Helmet>
      {/* Sidebar with responsive design */}
      <div className="d-none d-md-block">
        <Sidebar />
      </div>
      <main className="container-fluid mt-3">
        <div className="d-none d-md-block">
          <Header />
        </div>
        <hr />
        <section className="row mb-5">
          <div className="col-12 d-flex align-items-center">
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
              <div>
                <div className="d-flex align-items-center">
                  <h1>{jobData.job_title}</h1>
                  <button 
                    onClick={handleUpdateClick} 
                    className="btn btn-link p-0 ms-3"
                    aria-label="Update Job"
                  >
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                </div>
                <div className="d-flex flex-column">
                  <span className="text-muted">{jobData.company_name}</span>
                  <span>{jobData.industry_name}</span>
                </div>
              </div>
            </div>
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
              { label: 'Salary', value: jobData.salaryrange },
              { label: 'Industry', value: jobData.industry_name }
            ]}
            skills={jobData.skills || []}
          />
        </section>
      </main>
    </div>
  );
};

export default JobDescription;

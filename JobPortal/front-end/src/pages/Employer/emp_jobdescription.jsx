import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    <div className="d-flex flex-column flex-md-row">
      <Sidebar />
      <main className="container mt-3 flex-grow-1">
        <Header />
        <hr />
        <section className="row mb-5">
          <div className="col-md-8 d-flex align-items-center mb-3 mb-md-0">
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
                  <h1 className="h4">{jobData.job_title}</h1>
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
          <div className="col-md-4 text-end d-none d-md-block">
            {/* Additional content or buttons if needed */}
          </div>
        </section>
        <section className="row">
          <div className="col-12 col-md-8 mb-3 mb-md-0">
            <JobContent
              jobdescription={jobData.jobdescription}
              responsibilities={jobData.responsibilities ? jobData.responsibilities.split(',') : []}
              qualifications={jobData.qualifications ? jobData.qualifications.split(',') : []}
            />
          </div>
          <div className="col-12 col-md-4">
            <JobDetails
              jobInfo={[
                { label: 'Job Posted On', value: new Date(jobData.datecreated).toLocaleDateString() },
                { label: 'Job Type', value: jobData.jobtype },
                { label: 'Salary', value: jobData.salaryrange },
                { label: 'Industry', value: jobData.industry_name }
              ]}
              skills={jobData.skills || []}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default JobDescription;

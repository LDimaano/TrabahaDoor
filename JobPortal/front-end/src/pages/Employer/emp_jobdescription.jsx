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
  const [isSidebarVisible, setSidebarVisible] = useState(false); 

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

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };


  return (
    <div className="d-flex">
      <Helmet>
        <title>TrabahaDoor - Employer</title> 
      </Helmet>
      <div
        className={`col-auto p-0 d-lg-block ${isSidebarVisible ? 'd-block' : 'd-none'}`}
        style={{
          position: 'sticky',
          top: '0',
          height: '100vh',
          overflowY: 'auto',
          backgroundColor: '#f8f9fa',
          zIndex: 1000,
        }}
      >
        <Sidebar />
      </div>
      <main className="container-fluid mt-3 p-5">
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
                <span className="text-muted">{jobData.company_name} - {jobData.website}</span>
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
            benefits={jobData.benefits ? jobData.benefits.split(',') : []}
            educations={jobData.educations || []}     
          />
          <JobDetails
            jobInfo={[
              { label: 'Job Posted On', value: new Date(jobData.datecreated).toLocaleDateString() },
              { label: 'Job Type', value: jobData.jobtype },
              { label: 'Salary', value: jobData.salaryrange },
              { label: 'Industry', value: jobData.industry_name },
              { label: 'Available Positions', value: jobData.positions}
            ]}
            skills={jobData.skills || []}
          />
        </section>
      </main>
      {isSidebarVisible && (
        <div
          className="position-fixed w-100 h-100"
          style={{ top: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 998 }}
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default JobDescription;

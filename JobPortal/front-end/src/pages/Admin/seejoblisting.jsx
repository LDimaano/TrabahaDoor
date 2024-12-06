import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faArrowLeft, faBars } from '@fortawesome/free-solid-svg-icons';
import JobContent from '../../components/jobcontent';
import JobDetails from '../../components/jobdetails';
import Sidebar from '../../components/admin_sidepanel';
import AdminNavbar from '../../components/AdminNavbar'; // Import the new Navbar component

const JobDescription = () => {
  const navigate = useNavigate(); 
  const { jobId } = useParams();
  const [jobData, setJobData] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // State to control sidebar visibility

  const handleBack = () => {
    navigate(-1); 
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/joblistings/${jobId}`);
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
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarVisible ? 'd-block' : 'd-none'} d-md-block`}>
        <Sidebar />
      </div>

      <main className="flex-grow-1">
        <AdminNavbar toggleSidebar={toggleSidebar} /> {/* Include Navbar for mobile */}

        <section className="container mt-3">
          <section className="row mb-5">
            <div className="col-12 col-md-8 d-flex align-items-center">
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
                <span className="text-muted">{jobData.company_name} - {jobData.website}</span>
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
                { label: 'Salary', value: jobData.salaryrange }
              ]}
              skills={jobData.skills || []} 
            />
          </section>
        </section>
      </main>

      {/* Sidebar toggle button for mobile */}
      <button
        className="btn btn-primary d-md-none position-fixed"
        style={{ top: '10px', left: '10px', zIndex: 999 }}
        onClick={toggleSidebar}
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
    </div>
  );
};

export default JobDescription;

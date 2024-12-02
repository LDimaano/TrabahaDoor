import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/emp_side';
import Header from '../../components/emp_header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ApplicantJoblist from '../../components/emp_applicantlist';

const ApplicantDashboard = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [jobs, setJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [hiringStages, setHiringStages] = useState({});
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchApplicants();
    }
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/applicants/appliedapplicants/${jobId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to fetch applicants');
      }

      const data = await response.json();
      setJobs(data);

      const initialStages = data.reduce((acc, applicant) => {
        acc[applicant.user_id] = applicant.hiring_stage || 'Received';
        return acc;
      }, {});
      setHiringStages(initialStages);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching applicants:', error);
    }
  };

  const handleStageChangeInDashboard = async (userId, newStage) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/applicants/applications/${userId}/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hiringStage: newStage }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to update hiring stage');
      }

      setJobs(prevJobs =>
        prevJobs.map(job =>
          job.user_id === userId ? { ...job, hiring_stage: newStage } : job
        )
      );

      setHiringStages(prevStages => ({
        ...prevStages,
        [userId]: newStage,
      }));
      
      setRecommendedJobs(prevRecommended =>
        prevRecommended.map(recJob =>
          recJob.user_id === userId ? { ...recJob, hiring_stage: newStage } : recJob
        )
      );
    } catch (error) {
      console.error('Error updating hiring stage:', error.message);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const filteredListings = jobs.filter(listing =>
    listing.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.datecreated.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="d-flex">
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
      <main className="flex-grow-1 p-4">
        <Header />
        <section>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
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
              <h3>Applicants: {filteredListings.length}</h3>
            </div>
            <div className="input-group" style={{ maxWidth: '300px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search Applicants"
                value={searchTerm}
                onChange={handleSearch}
              />
              <button className="btn btn-outline-secondary">
                <FontAwesomeIcon icon={faFilter} />
              </button>
            </div>
          </div>
          <ApplicantJoblist
            currentListings={filteredListings}
            hiringStages={hiringStages}
            onStageChange={handleStageChangeInDashboard}
          />
        </section>
      </main>

      <button
        className="btn btn-primary d-lg-none position-fixed"
        style={{ top: '10px', left: '10px', zIndex: 999 }}
        onClick={toggleSidebar}
      >
        <i className="fa fa-bars"></i>
      </button>

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

export default ApplicantDashboard;

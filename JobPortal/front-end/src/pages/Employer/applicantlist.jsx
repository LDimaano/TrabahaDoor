import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/emp_side';
import Header from '../../components/emp_header';
import Pagination from '../../components/emp_pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ApplicantJoblist from '../../components/emp_applicantlist';

const ApplicantDashboard = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [jobs, setJobs] = useState([]); // List of all applicants
  const [recommendedJobs, setRecommendedJobs] = useState([]); // Recommended applicants
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [listingsPerPage] = useState(10);
  const [error, setError] = useState(null);
  const [hiringStages, setHiringStages] = useState({}); // Hiring stages for applicants

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

      // Initialize hiringStages with fetched data
      const initialStages = data.reduce((acc, applicant) => {
        acc[applicant.user_id] = applicant.hiring_stage || 'Received'; // Assuming hiring_stage is used
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

      // Update the hiring stage in both jobs and hiringStages state
      setJobs(prevJobs =>
        prevJobs.map(job =>
          job.user_id === userId ? { ...job, hiring_stage: newStage } : job
        )
      );

      // Update hiring stages for both jobs and recommended jobs
      setHiringStages(prevStages => ({
        ...prevStages,
        [userId]: newStage,
      }));

      // Update recommended jobs if they share the same state
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
    setCurrentPage(1); // Reset to first page on search
  };

  const filteredListings = jobs.filter(listing =>
    listing.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.datecreated.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = filteredListings.slice(indexOfFirstListing, indexOfLastListing);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="d-flex">
      <Sidebar />
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
            currentListings={currentListings}
            hiringStages={hiringStages}
            onStageChange={handleStageChangeInDashboard}
          />
          <Pagination
            listingsPerPage={listingsPerPage}
            totalListings={filteredListings.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </section>
      </main>
    </div>
  );
};

export default ApplicantDashboard;

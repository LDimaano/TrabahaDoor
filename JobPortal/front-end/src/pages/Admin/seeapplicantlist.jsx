import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/admin_sidepanel';
import Pagination from '../../components/emp_pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ApplicantJoblist from '../../components/admin_viewapplicantlist';

const ApplicantDashboard = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [listingsPerPage] = useState(10);
  const [error, setError] = useState(null);
  const [hiringStages, setHiringStages] = useState({});

  useEffect(() => {
    if (jobId) {
      fetchApplicants();
    }
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/appliedapplicants/${jobId}`, {
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

      await fetchApplicants();
    } catch (error) {
      console.error('Error updating hiring stage:', error.message);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredListings = jobs.filter(listing =>
    listing.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = filteredListings.slice(indexOfFirstListing, indexOfLastListing);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="d-flex flex-column flex-lg-row">
      <Sidebar className="d-none d-lg-block" />
      <main className="flex-grow-1 p-3">
        <section>
          <div
            className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3"
            style={{ gap: '1rem' }}
          >
            <div className="d-flex align-items-center mb-2 mb-md-0" style={{ flexWrap: 'wrap' }}>
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
              <h3 className="text-center text-md-start" style={{ fontSize: '1.2rem', marginBottom: '0' }}>
                Applicants: {filteredListings.length}
              </h3>
            </div>
            <div className="input-group" style={{ maxWidth: '100%', width: '300px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search Applicants"
                value={searchTerm}
                onChange={handleSearch}
                style={{ fontSize: '0.9rem' }}
              />
              <button className="btn btn-outline-secondary" style={{ fontSize: '0.9rem' }}>
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

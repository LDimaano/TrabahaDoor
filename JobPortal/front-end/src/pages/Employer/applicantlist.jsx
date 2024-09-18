import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import Sidebar from '../../components/emp_side';
import Header from '../../components/emp_header';
import Pagination from '../../components/emp_pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faArrowLeft } from '@fortawesome/free-solid-svg-icons'; // Import the arrow icon
import ApplicantJoblist from '../../components/emp_applicantlist';

const ApplicantDashboard = () => {
  const navigate = useNavigate(); 
  const { jobId } = useParams(); // Get jobId from URL params
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [listingsPerPage, setListingsPerPage] = useState(10);
  const [error, setError] = useState(null);

  const [hiringStages, setHiringStages] = useState({});

    const handleHiringStageChange = (userId, newStage) => {
      setHiringStages((prevStages) => ({
        ...prevStages,
        [userId]: newStage,
      }));
    };


  const handleBack = () => {
    navigate(-1); 
  };

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/applicants/appliedapplicants/${jobId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', 
        });
  
        if (response.status === 404) {
          // Handle 404 status differently (e.g., do nothing)
          console.log('No applicants found (404).');
          return;
        }
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching applicants:', error);
      }
    };
  
    if (jobId) { // Ensure jobId exists before fetching
      fetchApplicants();
    }
  }, [jobId]); // Re-run effect when jobId changes
  
  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredListings = jobs.filter(listing =>
    listing.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.datecreated.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = filteredListings.slice(indexOfFirstListing, indexOfLastListing);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                }}>
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
              onHiringStageChange={handleHiringStageChange}
            />

          <Pagination listingsPerPage={listingsPerPage} totalListings={filteredListings.length} paginate={paginate} currentPage={currentPage} />
        </section>
      </main>
    </div>
  );
};

export default ApplicantDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from '../../components/jsheader';
import Pagination from '../../components/pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import JobseekerJoblist from '../../components/js_joblistinglist';

const JobseekerDashboard = () => {
  const navigate = useNavigate(); 
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
    const fetchJobListings = async () => {
      try {
        // Retrieve the user_id from sessionStorage
        const userId = sessionStorage.getItem('user_id');
        console.log("retrieved userid:  ", userId);

  
        if (!userId) {
          console.error('User ID not found in sessionStorage');
          return;
        }
  
        const response = await fetch(`http://localhost:5000/api/jobseekers/getUserJobListings?user_id=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.status === 404) {
          console.log('No job listings found (404).');
          setJobs([]); // Optionally set an empty list if no listings are found
          return;
        }
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching job listings:', error);
      }
    };
  
    fetchJobListings();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredListings = jobs.filter(listing =>
    listing.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.date_applied.toLowerCase().includes(searchTerm.toLowerCase()) // Assuming you're using date_applied
  );

  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = filteredListings.slice(indexOfFirstListing, indexOfLastListing);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="d-flex">
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
              <h3 style={{ marginTop: '20px' }}>Job Listings: {filteredListings.length}</h3> {/* Add top margin here */}
            </div>
            <div className="input-group" style={{ maxWidth: '300px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search Job Listings"
                value={searchTerm}
                onChange={handleSearch}
              />
              <button className="btn btn-outline-secondary">
                <FontAwesomeIcon icon={faFilter} />
              </button>
            </div>
          </div>
  
          <div style={{ 
            marginTop: '40px',  // Add top margin for job listings
            marginLeft: '40px', // Add left margin
            marginRight: '40px', // Add right margin
          }}> 
            <JobseekerJoblist 
              currentListings={currentListings}
              hiringStages={hiringStages}
              onHiringStageChange={handleHiringStageChange}
            />
  
            <Pagination 
              listingsPerPage={listingsPerPage} 
              totalListings={filteredListings.length} 
              paginate={paginate} 
              currentPage={currentPage} 
            />
          </div>
        </section>
      </main>
    </div>
  );
  
};

export default JobseekerDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from '../../components/jsheader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch} from '@fortawesome/free-solid-svg-icons';
import JobseekerJoblist from '../../components/js_joblistinglist';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../../css/pagination.css'

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
        // Step 1: Log the user ID fetched from sessionStorage
        const userId = sessionStorage.getItem('user_id');
        if (!userId) {
          console.error('User ID not found in sessionStorage');
          return;
        }
        console.log(`User ID fetched from sessionStorage: ${userId}`);
  
        // Step 2: Log the API endpoint being called
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/jobseekers/getUserJobListings?user_id=${userId}`;
        console.log(`Fetching job listings from API: ${apiUrl}`);
  
        // Step 3: Fetch the data and log the response status
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(`API Response Status: ${response.status}`);
  
        if (response.status === 404) {
          console.log('No job listings found (404).');
          setJobs([]);
          return;
        }
  
        if (!response.ok) {
          console.error(`HTTP Error! Status: ${response.status}`);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        // Step 4: Parse and log the raw JSON response
        const data = await response.json();
        console.log('Raw API Response:', data);
  
        // Step 5: Validate the data format
        if (!Array.isArray(data)) {
          console.error('Invalid response format. Expected an array:', data);
          throw new Error('Invalid response format');
        }
  
        // Step 6: Log the processed job listings before updating state
        console.log('Final Processed Job Listings:', data);
        setJobs(data);
      } catch (error) {
        // Step 7: Log any error encountered
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
    listing.date_applied.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = filteredListings.slice(indexOfFirstListing, indexOfLastListing);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredListings.length / listingsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="d-flex">
      <main className="flex-grow-1 p-4">
        <Header />
        <section>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
            <h3 style={{ marginTop: '20px', marginLeft: '100px' }}>Job Listings: {filteredListings.length}</h3>
            </div>
            <div className="input-group" style={{ maxWidth: '300px', marginRight: '100px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search Job Listings"
                value={searchTerm}
                onChange={handleSearch}
              />
              <button className="btn btn-outline-secondary">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </div>
  
          <div style={{ 
            marginTop: '40px',
            marginLeft: '40px',
            marginRight: '40px',
          }}>
            <JobseekerJoblist 
              currentListings={currentListings}
              hiringStages={hiringStages}
              onHiringStageChange={handleHiringStageChange}
            />
          </div>
        </section>
        <nav className="pagination-container">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <a onClick={() => paginate(currentPage - 1)} href="#" className="page-link">
                &laquo;
              </a>
            </li>
            {pageNumbers.map(number => (
              <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                <a onClick={() => paginate(number)} href="#" className="page-link">
                  {number}
                </a>
              </li>
            ))}
            <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
              <a onClick={() => paginate(currentPage + 1)} href="#" className="page-link">
                &raquo;
              </a>
            </li>
          </ul>
        </nav>
      </main>
    </div>
  );
};

export default JobseekerDashboard;

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/emp_side';
import Header from '../../components/emp_header';
import Pagination from '../../components/emp_pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import ApplicantJoblist from '../../components/emp_joblist';

const ApplicantDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [listingsPerPage, setListingsPerPage] = useState(10);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/employers/joblistings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', 
        });
  
        if (response.status === 404) {
          // Handle 404 status differently (e.g., do nothing)
          console.log('No job listings found (404).');
          return;
        }
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        
        // Check if data is not empty
        if (data && data.length > 0) {
          setJobs(data);
        }
        // If data is empty, do nothing and keep the current jobs state
  
      } catch (error) {
        setError(error.message);
        console.error('Error fetching job listings:', error);
      }
    };
  
    fetchJobs();
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
            <h3>Job Listings: {filteredListings.length}</h3>
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
          <ApplicantJoblist currentListings={currentListings} />
          <Pagination listingsPerPage={listingsPerPage} totalListings={filteredListings.length} paginate={paginate} currentPage={currentPage} />
        </section>
      </main>
    </div>
  );
};

export default ApplicantDashboard;

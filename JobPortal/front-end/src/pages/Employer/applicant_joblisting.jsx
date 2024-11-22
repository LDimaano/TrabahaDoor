import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/emp_side';
import Header from '../../components/emp_header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faBars } from '@fortawesome/free-solid-svg-icons';
import ApplicantJoblist from '../../components/emp_joblist';

const ApplicantDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [listingsPerPage, setListingsPerPage] = useState(10);
  const [error, setError] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); 

  useEffect(() => {
    const userId = sessionStorage.getItem('user_id');
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employers/joblistings/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.status === 404) {
          console.log('No job listings found (404).');
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.length > 0) {
          setJobs(data);
        }
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

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="d-flex flex-column flex-lg-row">
      <div className={`sidebar ${isSidebarVisible ? 'd-block' : 'd-none'} d-lg-block`}>
        <Sidebar />
      </div>

      <main className="flex-grow-1 p-3">
        <Header />
        <section>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3" style={{ gap: '1rem' }}>
            <h3>Job Listings: {filteredListings.length}</h3>
            <div className="input-group" style={{ maxWidth: '100%', width: '300px' }}>
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
          <ApplicantJoblist currentListings={currentListings} setCurrentListings={setJobs} />
        </section>
      </main>
      <button
        className="btn btn-primary d-lg-none position-fixed"
        style={{ top: '10px', left: '10px', zIndex: 999 }}
        onClick={toggleSidebar}
      >
        <FontAwesomeIcon icon={faBars} />

      </button>
    </div>
  );
};

export default ApplicantDashboard;

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin_sidepanel';
import Pagination from '../../components/admin_pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import Joblist from '../../components/admin_viewjoblistings';
import AdminNavbar from '../../components/AdminNavbar'; 

const JobDashboard = () => {
  const [joblisting, setJoblisting] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [listingsPerPage, setListingsPerPage] = useState(20);
  const [error, setError] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); 

  useEffect(() => {
    const fetchJoblistings = async () => {
      const userId = sessionStorage.getItem('user_id');
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/viewjoblisting/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.length > 0) {
          setJoblisting(data);
        }

      } catch (error) {
        setError(error.message);
        console.error('Error fetching joblisting:', error);
      }
    };

    fetchJoblistings();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredListings = joblisting.filter(listing =>
    listing.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.job_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = filteredListings.slice(indexOfFirstListing, indexOfLastListing);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="d-flex">
      <div className={`col-auto p-0 ${isSidebarVisible ? 'd-block' : 'd-none'} d-lg-block`}>
        <Sidebar />
      </div>
      <main className="flex-grow-1 p-4">
        <AdminNavbar toggleSidebar={toggleSidebar} /> 
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
          {filteredListings.length > 0 ? (
            <>
              <Joblist currentListings={currentListings} />
              <Pagination
                listingsPerPage={listingsPerPage}
                totalListings={filteredListings.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </>
          ) : (
            <p>No job listings found.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default JobDashboard;

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin_sidepanel';
import Pagination from '../../components/admin_pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import ApplicantJoblist from '../../components/admin_viewapplicants';
import AdminNavbar from '../../components/AdminNavbar'; // Import the new Navbar component

const ApplicantDashboard = () => {
  const [applicants, setApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [listingsPerPage, setListingsPerPage] = useState(5);
  const [error, setError] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // State to control sidebar visibility

  useEffect(() => {
    const fetchApplicants = async () => {
      const userId = sessionStorage.getItem('user_id');
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/viewjobseekers/${userId}`, {
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
        
        // Check if data is not empty
        if (data && data.length > 0) {
          setApplicants(data);
        }
        // If data is empty, do nothing and keep the current applicants state

      } catch (error) {
        setError(error.message);
        console.error('Error fetching applicants:', error);
      }
    };

    fetchApplicants();
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

  const filteredListings = applicants.filter(listing =>
    listing.full_name.toLowerCase().includes(searchTerm.toLowerCase()) 
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
        <AdminNavbar toggleSidebar={toggleSidebar} /> {/* Include Navbar for mobile */}
        <section>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Applicants: {filteredListings.length}</h3>
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
              <ApplicantJoblist currentListings={currentListings} />
              <Pagination
                listingsPerPage={listingsPerPage}
                totalListings={filteredListings.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </>
          ) : (
            <p>No Applicants found.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default ApplicantDashboard;

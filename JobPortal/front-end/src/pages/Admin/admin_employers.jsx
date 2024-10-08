import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin_sidepanel';
import Pagination from '../../components/admin_pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import Employerlist from '../../components/admin_viewemployers';

const ApplicantDashboard = () => {
  const [employers, setEmployers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [listingsPerPage, setListingsPerPage] = useState(5);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/viewemployers', {
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
          setEmployers(data);
        }
        // If data is empty, do nothing and keep the current employers state

      } catch (error) {
        setError(error.message);
        console.error('Error fetching employers:', error);
      }
    };

    fetchEmployers();
  }, []);
  
  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredListings = employers.filter(listing =>
    listing.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = filteredListings.slice(indexOfFirstListing, indexOfLastListing);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="d-flex">
      <Sidebar />
      <main className="flex-grow-1 p-4">
        <section>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Employers: {filteredListings.length}</h3>
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
              <Employerlist currentListings={currentListings} />
              <Pagination
                listingsPerPage={listingsPerPage}
                totalListings={filteredListings.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </>
          ) : (
            <p>No Employers Found.</p>
          )}        </section>
      </main>
    </div>
  );
};

export default ApplicantDashboard;

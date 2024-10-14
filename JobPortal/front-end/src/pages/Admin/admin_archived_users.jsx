import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin_sidepanel';
import Pagination from '../../components/admin_pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import Userlist from '../../components/admin_viewarchivedusers';

const ApplicantDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [listingsPerPage, setListingsPerPage] = useState(5); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = sessionStorage.getItem('user_id');
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/viewarchivedusers/${userId}`, {
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
          setUsers(data);
        }
      } catch (error) {
        setError(error.message);
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page after search
  };

  const filteredListings = users.filter(listing =>
    (listing.full_name ? listing.full_name.toLowerCase() : "").includes(searchTerm.toLowerCase()) ||
    (listing.company_name ? listing.company_name.toLowerCase() : "").includes(searchTerm.toLowerCase())
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
            <h3>Users: {filteredListings.length}</h3>
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
              <Userlist currentListings={currentListings} />
              <Pagination
                listingsPerPage={listingsPerPage}
                totalListings={filteredListings.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </>
          ) : (
            <p>No Archived Users Found.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default ApplicantDashboard;

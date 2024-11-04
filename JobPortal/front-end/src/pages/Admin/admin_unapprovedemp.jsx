import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin_sidepanel';
import Pagination from '../../components/admin_pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import Userlist from '../../components/admin_viewunapprovedemp';
import AdminNavbar from '../../components/AdminNavbar'; // Import the new Navbar component

const ApplicantDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [listingsPerPage, setListingsPerPage] = useState(20);
  const [error, setError] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // State to control sidebar visibility

  const fetchUsers = async () => {
    try {
      const userId = sessionStorage.getItem('user_id');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/viewunapprovedemp/${userId}`, {
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
        setUsers(data); // Set users state directly
      }
    } catch (error) {
      setError(error.message);
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers(); // Call fetchUsers on mount
  }, []);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

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
      <div className={`col-auto p-0 ${isSidebarVisible ? 'd-block' : 'd-none'} d-lg-block`}>
        <Sidebar />
      </div>
      <main className="flex-grow-1 p-4">
        <AdminNavbar toggleSidebar={toggleSidebar} /> {/* Include Navbar for mobile */}
        <section>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Unapproved Employers: {filteredListings.length}</h3>
            <div className="input-group" style={{ maxWidth: '300px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search Employers"
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
              <Userlist currentListings={currentListings} fetchUsers={fetchUsers} />
              <Pagination
                listingsPerPage={listingsPerPage}
                totalListings={filteredListings.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </>
          ) : (
            <p>No Unapproved Employers found.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default ApplicantDashboard;

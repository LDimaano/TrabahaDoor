import React, { useState } from 'react';
// import Sidebar from '../components/emp_side';
import Header from '../../components/emp_header';
import ApplicantDetails from '../../components/app_details';
import ApplicantProfile from '../../components/app_profile';
import ApplicantCard from '../../components/app_card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

const CompanyDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="d-flex">
      <main className="flex-grow-1 p-4">
        <Header />
        <section>
          {/* Search Bar (if applicable) */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Applicant Details</h3>
            <div className="input-group" style={{ maxWidth: '300px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search Applicant Details"
                value={searchTerm}
                onChange={handleSearch}
              />
              <button className="btn btn-outline-secondary">
                <FontAwesomeIcon icon={faFilter} />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <ApplicantDetails />
          <div className="d-flex">
            <div className="flex-fill me-4">
              <ApplicantProfile />
            </div>
            <ApplicantCard />
          </div>
        </section>
      </main>
    </div>
  );
};

export default CompanyDashboard;

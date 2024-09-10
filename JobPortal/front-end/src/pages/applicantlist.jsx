// src/pages/ApplicantDashboard.js
import React, { useState } from 'react';
import Sidebar from '../components/emp_side';
import Header from '../components/emp_header';
import ApplicantTable from '../components/emp_applicant';
import Pagination from '../components/emp_pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter} from '@fortawesome/free-solid-svg-icons';


const ApplicantDashboard = () => {
  const [applicants, setApplicants] = useState([
    { name: 'Jake Gyll', avatar: `${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`, status: 'Inreview', date: '13 July, 2025', role: 'Elementary Teacher' },
    // ... (other applicants)
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [applicantsPerPage, setApplicantsPerPage] = useState(10);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredApplicants = applicants.filter(applicant =>
    applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    applicant.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastApplicant = currentPage * applicantsPerPage;
  const indexOfFirstApplicant = indexOfLastApplicant - applicantsPerPage;
  const currentApplicants = filteredApplicants.slice(indexOfFirstApplicant, indexOfLastApplicant);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="d-flex">
      <Sidebar />
      <main className="flex-grow-1 p-4">
        <Header />
        <section>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Matched Applicants: {filteredApplicants.length}</h3>
            <div className="input-group" style={{ maxWidth: '300px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search Applicants"
                value={searchTerm}
                onChange={handleSearch}
              />
              <button className="btn btn-outline-secondary">
                <FontAwesomeIcon icon={faFilter} />
              </button>
            </div>
          </div>
          <ApplicantTable applicants={applicants} currentApplicants={currentApplicants} setApplicants={setApplicants} />
          <Pagination applicantsPerPage={applicantsPerPage} totalApplicants={filteredApplicants.length} paginate={paginate} currentPage={currentPage} />
        </section>
      </main>
    </div>
  );
};

export default ApplicantDashboard;

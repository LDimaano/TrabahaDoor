import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faFilter, faBuilding, faUserFriends, faClipboardList, faEllipsisH, faPlus } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const ApplicantDashboard = () => {
  const [applicants, setApplicants] = useState([
    { name: 'Jake Gyll', avatar: `${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`, status: 'Inreview', date: '13 July, 2025', role: 'Elementary Teacher' },
    // ... (other applicants)
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [applicantsPerPage, setApplicantsPerPage] = useState(10);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingStatus, setEditingStatus] = useState('');

  const navigate = useNavigate();

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

  const handleStatusChange = (index, newStatus) => {
    const updatedApplicants = [...applicants];
    updatedApplicants[index].status = newStatus;
    setApplicants(updatedApplicants);
    setEditingIndex(null);
  };

  const handlePostJobClick = () => {
    navigate('/jobposting');
  };

  const handleSeeApplication = (applicant) => {
    navigate('/applicantdetail', { state: { applicant } });
  };

  return (
    <div className="d-flex">
      <aside className="bg-dark text-white p-3 d-flex flex-column" style={{ width: '250px', height: '100vh', position: 'relative' }}>
        <div className="text-center mb-4">
          <img src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`} alt="TrabahaDoor Logo" className="img-fluid" style={{ width: '50px' }} />
          <h4 className="mt-2">TrabahaDoor</h4>
        </div>
        <nav className="flex-grow-1">
          <ul className="nav flex-column">
            <li className="nav-item">
              <a href="#profile" className="nav-link text-white">
                <FontAwesomeIcon icon={faBuilding} className="me-2" />
                Profile
              </a>
            </li>
            <li className="nav-item active">
              <a href="#applicants" className="nav-link text-white">
                <FontAwesomeIcon icon={faUserFriends} className="me-2" />
                All Applicants
              </a>
            </li>
            <li className="nav-item">
              <a href="#jobs" className="nav-link text-white">
                <FontAwesomeIcon icon={faClipboardList} className="me-2" />
                Job Listing
              </a>
            </li>
          </ul>
        </nav>
        <div className="mt-4 text-center" style={{ position: 'absolute', bottom: '20px', left: '0', right: '0' }}>
          <img src={`${process.env.PUBLIC_URL}/assets/profile.png`} alt="User Avatar" className="img-fluid rounded-circle" style={{ width: '50px', borderRadius: '50%' }} />
          <div className="mt-2">
            <p className="mb-0">Maria Kelly</p>
            <small>MariaKlly@email.com</small>
          </div>
        </div>
      </aside>

      <main className="flex-grow-1 p-4">
        <header className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <img src={`${process.env.PUBLIC_URL}/assets/profile_company.png`} alt="Company Logo" className="me-3" style={{ width: '50px' }} />
            <div>
              <span className="text-muted">Company</span>
              <h2>Saint Anthony Montessori</h2>
            </div>
          </div>
          <div>
            <FontAwesomeIcon icon={faBell} className="me-3" />
            <button className="btn btn-primary" onClick={handlePostJobClick}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Post a job
            </button>
          </div>
        </header>

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

          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Hiring Stage</th>
                  <th>Applied Date</th>
                  <th>Job Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentApplicants.map((applicant, index) => (
                  <tr key={index}>
                    <td>
                      <img src={applicant.avatar} alt={`${applicant.name}'s avatar`} className="me-2" style={{ width: '50px', borderRadius: '50%' }} />
                      {applicant.name}
                    </td>
                    <td>
                      {editingIndex === index ? (
                        <select
                          className="form-select"
                          value={editingStatus || applicant.status}
                          onChange={(e) => setEditingStatus(e.target.value)}
                          onBlur={() => handleStatusChange(index, editingStatus || applicant.status)}
                        >
                          <option value="Inreview">Inreview</option>
                          <option value="Declined">Declined</option>
                          <option value="Hired">Hired</option>
                        </select>
                      ) : (
                        applicant.status
                      )}
                    </td>
                    <td>{applicant.date}</td>
                    <td>{applicant.role}</td>
                    <td>
                      <button className="btn btn-link" onClick={() => handleSeeApplication(applicant)}>
                        See Application
                      </button>
                      <FontAwesomeIcon icon={faEllipsisH} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <nav>
            <ul className="pagination">
              {Array.from({ length: Math.ceil(filteredApplicants.length / applicantsPerPage) }).map((_, index) => (
                <li key={index} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => paginate(index + 1)}>
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </section>
      </main>
    </div>
  );
};

export default ApplicantDashboard;

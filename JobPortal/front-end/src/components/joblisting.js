import React, { useState } from 'react';
import '../css/joblisting.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faFilter, faBuilding, faUserFriends, faClipboardList, faEllipsisH, faPlus } from '@fortawesome/free-solid-svg-icons';

const ApplicantDashboard = () => {
  const [applicants, setApplicants] = useState([
    { name: 'Jake Gyll', avatar: `${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`, status: 'Inreview', date: '13 July, 2025', role: 'Elementary Teacher' },
    { name: 'Guy Hawkins', avatar: `${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`, status: 'Inreview', date: '13 July, 2025', role: 'English Teacher' },
    { name: 'Cyndy Lillibridge', avatar: `${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`, status: 'Inreview', date: '12 July, 2025', role: 'Math Teacher' },
    { name: 'Rodolfo Goode', avatar: `${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`, status: 'Declined', date: '11 July, 2025', role: 'MAPEH Teacher' },
    { name: 'Leif Floyd', avatar: `${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`, status: 'Hired', date: '11 July, 2025', role: 'Teacher Assistant' },
    { name: 'Jenny Wilson', avatar: `${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`, status: 'Hired', date: '9 July, 2025', role: 'Science Teacher' },
    { name: 'Jerome Bell', avatar: `${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`, status: 'Hired', date: '5 July, 2025', role: 'English Teacher' },
    { name: 'Eleanor Pena', avatar: `${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`, status: 'Declined', date: '5 July, 2025', role: 'Elementary Teacher' },
    { name: 'Darrell Steward', avatar: `${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`, status: 'Declined', date: '3 July, 2025', role: 'Filipino Teacher' },
    { name: 'Floyd Miles', avatar: `${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`, status: 'Declined', date: '1 July, 2025', role: 'Math Teacher' },
    { name: 'BINI MALOI', avatar: `${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`, status: 'Declined', date: '1 July, 2025', role: 'Math Teacher' },
    { name: 'BINI AIAH', avatar: `${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`, status: 'Declined', date: '1 July, 2025', role: 'Math Teacher' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [applicantsPerPage, setApplicantsPerPage] = useState(10);
  const [editingIndex, setEditingIndex] = useState(null); // Track the index of the applicant being edited
  const [editingStatus, setEditingStatus] = useState(''); // Track the new status being selected

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

  return (
    <div className="dashboardContainer">
      <aside className="sidebar">
        <div className="logo">
          <img src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`} alt="TrabahaDoor Logo" className="logoImage" />
          <span className="logoText">TrabahaDoor</span>
        </div>
        <nav className="sidebarNav">
          <ul className="navList">
            <li className="navItem">
              <a href="#profile" className="navLink">
                <FontAwesomeIcon icon={faBuilding} className="navIcon" />
                Profile
              </a>
            </li>
            <li className="navItem active">
              <a href="#applicants" className="navLink">
                <FontAwesomeIcon icon={faUserFriends} className="navIcon" />
                All Applicants
              </a>
            </li>
            <li className="navItem">
              <a href="#jobs" className="navLink">
                <FontAwesomeIcon icon={faClipboardList} className="navIcon" />
                Job Listing
              </a>
            </li>
          </ul>
        </nav>
        <div className="userProfile">
          <img src={`${process.env.PUBLIC_URL}/assets/profile.png`} alt="User Avatar" className="userAvatar" />
          <div className="userInfo">
            <span className="userName">Maria Kelly</span>
            <span className="userEmail">MariaKlly@email.com</span>
          </div>
        </div>
      </aside>
      <main className="content">
        <header className="topNav">
          <div className="companyInfo">
            <img src={`${process.env.PUBLIC_URL}/assets/profile_company.png`} alt="Company Logo" className="companyLogo" />
            <div className="companyDetails">
              <span className="companyLabel">Company</span>
              <h1 className="companyName">
                Saint Anthony Montessori
              </h1>
            </div>
          </div>
          <div className="actions">
            <FontAwesomeIcon icon={faBell} className="notificationIcon" />
            <button className="postJobButton">
              <FontAwesomeIcon icon={faPlus} className="postJobIcon" />
              Post a job
            </button>
          </div>
        </header>
        <section className="applicantSection">
          <header className="sectionHeader">
            <h2 className="sectionTitle">Matched Applicants : {filteredApplicants.length}</h2>
            <div className="filterContainer">
              <input
                type="text"
                placeholder="Search Applicants"
                className="searchInput"
                aria-label="Search Applicants"
                value={searchTerm}
                onChange={handleSearch}
              />
              <button className="filterButton" aria-label="Filter">
                <FontAwesomeIcon icon={faFilter} className="filterIcon" />
                Filter
              </button>
            </div>
          </header>
          <div className="applicantList">
            <div className="listHeader">
              <div className="headerCell">
                <input type="checkbox" className="checkbox" aria-label="Select all applicants" />
                <span className="headerText">Full Name</span>
              </div>
              <div className="headerCell">
                <span className="headerText">Hiring Stage</span>
              </div>
              <div className="headerCell">
                <span className="headerText">Applied Date</span>
              </div>
              <div className="headerCell">
                <span className="headerText">Job Role</span>
              </div>
              <div className="headerCell">
                <span className="headerText">Action</span>
              </div>
            </div>
            {currentApplicants.map((applicant, index) => (
              <div key={index} className="applicantRow">
                <div className="nameCell">
                  <input type="checkbox" className="checkbox" aria-label={`Select ${applicant.name}`} />
                  <img src={applicant.avatar} alt="" className="avatar" />
                  <span className="name">{applicant.name}</span>
                </div>
                <div
                  className={`statusCell ${applicant.status.toLowerCase()}`}
                  onClick={() => setEditingIndex(index)} // Enable editing mode when the cell is clicked
                >
                  {editingIndex === index ? (
                    <select
                      value={editingStatus || applicant.status}
                      onChange={(e) => setEditingStatus(e.target.value)}
                      onBlur={() => handleStatusChange(index, editingStatus || applicant.status)} // Update the status when the select loses focus
                    >
                      <option value="Inreview">Inreview</option>
                      <option value="Declined">Declined</option>
                      <option value="Hired">Hired</option>
                    </select>
                  ) : (
                    applicant.status
                  )}
                </div>
                <div className="dateCell">{applicant.date}</div>
                <div className="roleCell">{applicant.role}</div>
                <div className="actionCell">
                  <button className="actionButton">See Application</button>
                  <FontAwesomeIcon icon={faEllipsisH} className="moreIcon" />
                </div>
              </div>
            ))}
          </div>
          <div className="paginationContainer">
            <div className="viewSelector">
              <label htmlFor="viewSelect" className="viewLabel">View</label>
              <select
                id="viewSelect"
                className="viewSelect"
                value={applicantsPerPage}
                onChange={(e) => setApplicantsPerPage(Number(e.target.value))}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <span className="viewText">/ page</span>
            </div>
            <div className="pagination">
              <button
                className="prevButton"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                className="nextButton"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentApplicants.length < applicantsPerPage}
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ApplicantDashboard;

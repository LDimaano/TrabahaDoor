import React, { useState } from 'react';
import styles from '../css/joblisting.module.css';
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
  const [editingIndex, setEditingIndex] = useState(null); 
  const [editingStatus, setEditingStatus] = useState('');

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
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <img src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`} alt="TrabahaDoor Logo" className={styles.logoImage} />
          <span className={styles.logoText}>TrabahaDoor</span>
        </div>
        <nav className={styles.sidebarNav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <a href="#profile" className={styles.navLink}>
                <FontAwesomeIcon icon={faBuilding} className={styles.navIcon} />
                Profile
              </a>
            </li>
            <li className={`${styles.navItem} ${styles.active}`}>
              <a href="#applicants" className={styles.navLink}>
                <FontAwesomeIcon icon={faUserFriends} className={styles.navIcon} />
                All Applicants
              </a>
            </li>
            <li className={styles.navItem}>
              <a href="#jobs" className={styles.navLink}>
                <FontAwesomeIcon icon={faClipboardList} className={styles.navIcon} />
                Job Listing
              </a>
            </li>
          </ul>
        </nav>
        <div className={styles.userProfile}>
          <img src={`${process.env.PUBLIC_URL}/assets/profile.png`} alt="User Avatar" className={styles.userAvatar} />
          <div className={styles.userInfo}>
            <span className={styles.userName}>Maria Kelly</span>
            <span className={styles.userEmail}>MariaKlly@email.com</span>
          </div>
        </div>
      </aside>
      <main className={styles.content}>
        <header className={styles.topNav}>
          <div className={styles.companyInfo}>
            <img src={`${process.env.PUBLIC_URL}/assets/profile_company.png`} alt="Company Logo" className={styles.companyLogo} />
            <div className={styles.companyDetails}>
              <span className={styles.companyLabel}>Company</span>
              <h1 className={styles.companyName}>
                Saint Anthony Montessori
              </h1>
            </div>
          </div>
          <div className={styles.actions}>
            <FontAwesomeIcon icon={faBell} className={styles.notificationIcon} />
            <button className={styles.postJobButton}>
              <FontAwesomeIcon icon={faPlus} className={styles.postJobIcon} />
              Post a job
            </button>
          </div>
        </header>
        <section className={styles.applicantSection}>
          <header className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Matched Applicants : {filteredApplicants.length}</h2>
            <div className={styles.filterContainer}>
              <input
                type="text"
                placeholder="Search Applicants"
                className={styles.searchInput}
                aria-label="Search Applicants"
                value={searchTerm}
                onChange={handleSearch}
              />
              <button className={styles.filterButton} aria-label="Filter">
                <FontAwesomeIcon icon={faFilter} className={styles.filterIcon} />
                Filter
              </button>
            </div>
          </header>
          <div className={styles.applicantList}>
            <div className={styles.listHeader}>
              <div className={styles.headerCell}>
                <input type="checkbox" className={styles.checkbox} aria-label="Select all applicants" />
                <span className={styles.headerText}>Full Name</span>
              </div>
              <div className={styles.headerCell}>
                <span className={styles.headerText}>Hiring Stage</span>
              </div>
              <div className={styles.headerCell}>
                <span className={styles.headerText}>Applied Date</span>
              </div>
              <div className={styles.headerCell}>
                <span className={styles.headerText}>Job Role</span>
              </div>
              <div className={styles.headerCell}>
                <span className={styles.headerText}>Action</span>
              </div>
            </div>
            {currentApplicants.map((applicant, index) => (
              <div key={index} className={styles.applicantRow}>
                <div className={styles.nameCell}>
                  <input type="checkbox" className={styles.checkbox} aria-label={`Select ${applicant.name}`} />
                  <img src={applicant.avatar} alt="" className={styles.avatar} />
                  <span className={styles.name}>{applicant.name}</span>
                </div>
                <div
                  className={`${styles.statusCell} ${styles[applicant.status.toLowerCase()]}`}
                  onClick={() => setEditingIndex(index)} 
                >
                  {editingIndex === index ? (
                    <select
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
                </div>
                <div className={styles.dateCell}>{applicant.date}</div>
                <div className={styles.roleCell}>{applicant.role}</div>
                <div className={styles.actionCell}>
                  <button className={styles.actionButton}>See Application</button>
                  <FontAwesomeIcon icon={faEllipsisH} className={styles.moreIcon} />
                </div>
              </div>
            ))}
          </div>
          <div className={styles.paginationContainer}>
            <div className={styles.viewSelector}>
              <label htmlFor="viewSelect" className={styles.viewLabel}>View</label>
              <select
                id="viewSelect"
                className={styles.viewSelect}
                value={applicantsPerPage}
                onChange={(e) => setApplicantsPerPage(Number(e.target.value))}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <span className={styles.viewText}>/ page</span>
            </div>
            <div className={styles.pagination}>
              <button
                className={styles.prevButton}
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                className={styles.nextButton}
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

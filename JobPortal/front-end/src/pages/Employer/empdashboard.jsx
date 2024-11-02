import React, { useState } from 'react';
import Sidebar from '../../components/emp_side';
import Header from '../../components/emp_header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const EmployerDashboard = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // State to control sidebar visibility

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="d-flex flex-column flex-lg-row">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarVisible ? 'd-block' : 'd-none'} d-lg-block`}>
        <Sidebar />
      </div>

      {/* Main content area */}
      <main className="flex-grow-1 p-3">
        <Header />
        <section>
          <h3>Welcome to the Employer Dashboard</h3>
          <p>Select options from the sidebar to manage job listings and view applicant details.</p>

          {/* Placeholder for main content or dashboard widgets */}
          <div className="mt-4 p-4 bg-light border rounded shadow-sm text-center">
            <p className="text-muted">Content Placeholder</p>
          </div>
        </section>
      </main>

      {/* Sidebar toggle button for mobile */}
      <button
        className="btn btn-primary d-lg-none position-fixed"
        style={{ top: '10px', left: '10px', zIndex: 999 }}
        onClick={toggleSidebar}
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
    </div>
  );
};

export default EmployerDashboard;

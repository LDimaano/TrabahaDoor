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

          {/* Dashboard Grid for Placeholders */}
          <div className="row g-4 mt-4">
            <div className="col-lg-6 col-md-12">
              <div className="bg-light border rounded shadow-sm p-4 text-center" style={{ height: '250px' }}>
                <p className="text-muted">Chart Placeholder 1</p>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="bg-light border rounded shadow-sm p-4 text-center" style={{ height: '250px' }}>
                <p className="text-muted">Chart Placeholder 2</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="bg-light border rounded shadow-sm p-4 text-center" style={{ height: '200px' }}>
                <p className="text-muted">Chart Placeholder 3</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="bg-light border rounded shadow-sm p-4 text-center" style={{ height: '200px' }}>
                <p className="text-muted">Chart Placeholder 4</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-12">
              <div className="bg-light border rounded shadow-sm p-4 text-center" style={{ height: '200px' }}>
                <p className="text-muted">Chart Placeholder 5</p>
              </div>
            </div>
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

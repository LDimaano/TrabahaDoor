import React, { useState } from 'react';
import Sidebar from '../../components/emp_side';
import Header from '../../components/emp_header';
import ChartPlaceholder1 from '../../components/emp_chart1';
import ChartPlaceholder2 from '../../components/emp_chart2';
import ChartPlaceholder3 from '../../components/emp_chart3';
import ChartPlaceholder4 from '../../components/emp_chart4';
import ChartPlaceholder5 from '../../components/emp_chart5';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const EmployerDashboard = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

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
          <h3>Dashboard</h3>

          {/* Dashboard Grid with Components */}
          <div className="row g-4 mt-4">
            <div className="col-lg-6 col-md-12">
              <ChartPlaceholder1 />
            </div>
            <div className="col-lg-6 col-md-12">
              <ChartPlaceholder2 />
            </div>
            <div className="col-lg-4 col-md-6">
              <ChartPlaceholder3 />
            </div>
            <div className="col-lg-4 col-md-6">
              <ChartPlaceholder4 />
            </div>
            <div className="col-lg-4 col-md-12">
              <ChartPlaceholder5 />
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

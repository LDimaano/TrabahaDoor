import React, { useState } from 'react';
import Header from '../../components/emp_header';
import SideBar from '../../components/emp_side';
import BarChart from '../../components/emp_barchart';

function DashboardAnalytics() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        {/* Sidebar */}
        <div className={`col-auto p-0 d-lg-block ${isSidebarVisible ? 'd-block' : 'd-none'}`}>
          <SideBar />
        </div>

        {/* Main content */}
        <div className="col">
          {/* Header */}
          <div className="py-3">
            <Header />
          </div>
          
          {/* Bar Chart */}
          <div className="chart-container">
            <BarChart />
          </div>
        </div>
      </div>
      
      {/* Sidebar toggle button for mobile */}
      <button
        className="btn btn-primary d-lg-none position-fixed"
        style={{ top: '10px', left: '10px', zIndex: 999 }}
        onClick={toggleSidebar}
      >
        <i className="fa fa-bars"></i>
      </button>
      
      {/* Overlay for sidebar on mobile */}
      {isSidebarVisible && (
        <div
          className="position-fixed w-100 h-100"
          style={{ top: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 998 }}
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}

export default DashboardAnalytics;

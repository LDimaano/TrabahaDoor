import React from 'react';
import Header from '../../components/emp_header';
import SideBar from '../../components/emp_side';
import BarChart from '../../components/emp_barchart';

function DashboardAnalytics() {
  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        {/* Sidebar */}
        <div className="col-auto p-0 d-none d-lg-block">
          <SideBar />
        </div>

        {/* Main content */}
        <div className="col">
          {/* Page Title */}
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
        onClick={() => document.querySelector('.sidebar-mobile').classList.toggle('d-none')}
      >
        <i className="fa fa-bars"></i>
      </button>

      {/* Mobile Sidebar */}
      <div className="sidebar-mobile d-none d-lg-none position-fixed bg-white" style={{ top: '0', left: '0', height: '100%', zIndex: 998, width: '250px' }}>
        <SideBar />
      </div>
    </div>
  );
}

export default DashboardAnalytics;

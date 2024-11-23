import React from 'react';
import Header from '../../components/emp_header';
import SideBar from '../../components/emp_side';
import BarChart from '../../components/emp_barchart';

function DashboardAnalytics() {
  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto p-0 d-none d-lg-block">
          <SideBar />
        </div>

        <div className="col">
          <div className="py-3">
            <Header />
          </div>
          <div className="chart-container">
            <BarChart />
          </div>
        </div>
      </div>
      <button
        className="btn btn-primary d-lg-none position-fixed"
        style={{ top: '10px', left: '10px', zIndex: 999 }}
        onClick={() => document.querySelector('.sidebar-mobile').classList.toggle('d-none')}
      >
        <i className="fa fa-bars"></i>
      </button>
      <div className="sidebar-mobile d-none d-lg-none position-fixed bg-white" style={{ top: '0', left: '0', height: '100%', zIndex: 998, width: '250px' }}>
        <SideBar />
      </div>
    </div>
  );
}

export default DashboardAnalytics;

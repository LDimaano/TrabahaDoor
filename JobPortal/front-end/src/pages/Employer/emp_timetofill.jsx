import React from 'react';
import Header from '../../components/emp_header';
import SideBar from '../../components/emp_side';
import BarChart from '../../components/emp_barchart';

function DashboardAnalytics() {
  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto p-0">
          <SideBar />
        </div>

        {/* Main content */}
        <div className="col">
          
          {/* Page Title */}
          <div className="py-3">
          <Header/>
          </div>
              <BarChart />
            </div>
          </div>
        </div>
  );
}

export default DashboardAnalytics;

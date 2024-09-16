import React from 'react';
import SideBar from '../../components/admin_sidepanel'; // Import the sidebar
import BarChart from '../../components/barchart'; // Import the bar chart
import TopHiringList from '../../components/tophiring'; // Import the TopHiringList

function DashboardAnalytics() {
  return (
    <div className="container-fluid">
      <div className="row flex-nowrap min-vh-100"> {/* Ensure sidebar takes full height */}
        {/* Sidebar */}
        <div className="col-lg-2 col-md-3 p-0 bg-light min-vh-100">
          <SideBar />
        </div>

        {/* Main content */}
        <div className="col-lg-10 col-md-9 ms-4"> {/* Increased margin start (ms) for left side */}
          {/* Page Title */}
          <div className="py-3">
            <h2 className="text-start" style={{ fontSize: '1.5rem' }}>TrabahaDoor Dashboard</h2> {/* Adjusted font size */}
          </div>

          {/* KPI Rectangles */}
          <div className="row mb-4 mt-3 gx-1"> {/* Reduced gap between columns */}
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="p-3 bg-white border rounded shadow-sm" style={{ height: '150px' }}>
                <h4 className="mb-2">KPI 1</h4>
                <p>Details</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="p-3 bg-white border rounded shadow-sm" style={{ height: '150px' }}>
                <h4 className="mb-2">KPI 2</h4>
                <p>Details</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="p-3 bg-white border rounded shadow-sm" style={{ height: '150px' }}>
                <h4 className="mb-2">KPI 3</h4>
                <p>Details</p>
              </div>
            </div>
          </div>

          {/* Bar Chart and Top Hiring List */}
          <div className="row gx-1">
            <div className="col-lg-7 col-md-10">
              <div className="bg-white border rounded shadow-sm p-3">
                <BarChart />
              </div>
            </div>
            <div className="col-lg-5 col-md-12">
              <div className="bg-white border rounded shadow-sm p-3">
                <TopHiringList title="Top Hiring Industries" />
                <TopHiringList title="Top Hiring Companies" />
              </div>
            </div>
          </div>

          {/* Placeholder for future main content */}
          <div>
            {/* Content goes here */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardAnalytics;

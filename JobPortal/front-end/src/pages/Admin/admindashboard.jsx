import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import SideBar from '../../components/admin_sidepanel';
import BarChart from '../../components/barchart';
import TopHiringIndustries from '../../components/tophiringindustries';
import TopHiringCompanies from '../../components/tophiringcompanies';
import './css/dashboard.css'; // Import CSS for custom styles

function DashboardAnalytics() {
  const [jobSeekerCount, setJobSeekerCount] = useState(0);
  const [employerCount, setEmployerCount] = useState(0);
  const [jobListingCount, setJobListingCount] = useState(0);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/dashboard-data`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setJobSeekerCount(data.jobSeekerCount);
        setEmployerCount(data.employerCount);
        setJobListingCount(data.jobListingCount);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    }
    fetchDashboardData();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="container-fluid px-3">
      <div className="row flex-nowrap">
        <div className={`col-auto p-0 ${isSidebarVisible ? 'd-block' : 'd-none'} d-lg-block`}>
          <SideBar />
        </div>

        <div className="col">
          <AdminNavbar toggleSidebar={toggleSidebar} />
          <div className="py-2">
            <h2 className="text-start fs-4">TrabahaDoor Dashboard</h2>
          </div>

          {/* KPI Cards */}
          <div className="row gx-2 mb-4">
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="p-3 bg-white border rounded shadow-sm d-flex align-items-center" style={{ height: '130px' }}>
                <div className="me-3">
                  <i className="fas fa-users fa-2x" style={{ color: '#007bff' }}></i>
                </div>
                <div>
                  <h6>Job Seekers</h6>
                  <p className="kpi-value fs-2 fw-bold mb-0">{jobSeekerCount}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="p-3 bg-white border rounded shadow-sm d-flex align-items-center" style={{ height: '130px' }}>
                <div className="me-3">
                  <i className="fas fa-briefcase fa-2x" style={{ color: '#007bff' }}></i>
                </div>
                <div>
                  <h6>Employers</h6>
                  <p className="kpi-value fs-2 fw-bold mb-0">{employerCount}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="p-3 bg-white border rounded shadow-sm d-flex align-items-center" style={{ height: '130px' }}>
                <div className="me-3">
                  <i className="fas fa-list fa-2x" style={{ color: '#007bff' }}></i>
                </div>
                <div>
                  <h6>Job Listings</h6>
                  <p className="kpi-value fs-2 fw-bold mb-0">{jobListingCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Top Hiring Panels */}
          <div className="row gx-2">
            <div className="col-lg-7 col-md-12 mb-3">
              <div className="bg-white border rounded shadow-sm p-3 h-100">
                <h5 className="mb-3">Job Seeker and Employer Trends</h5>
                <BarChart />
              </div>
            </div>
            <div className="col-lg-5 col-md-12 mb-3">
              <div className="bg-white border rounded shadow-sm p-3 h-100">
                <h5 className="mb-3">Top Hiring Insights</h5>
                <TopHiringIndustries title="Top Hiring Industries" />
                <TopHiringCompanies title="Top Hiring Companies" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardAnalytics;

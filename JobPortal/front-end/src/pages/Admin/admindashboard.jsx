import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar'; // Import the new Navbar component
import SideBar from '../../components/admin_sidepanel';
import BarChart from '../../components/barchart';
import TopHiringIndustries from '../../components/tophiringindustries';
import TopHiringCompanies from '../../components/tophiringcompanies';

function DashboardAnalytics() {
  const [jobSeekerCount, setJobSeekerCount] = useState(0);
  const [employerCount, setEmployerCount] = useState(0);
  const [jobListingCount, setJobListingCount] = useState(0);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // State to control sidebar visibility

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/dashboard-data`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('Fetched data:', data);
  
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
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className={`col-auto p-0 ${isSidebarVisible ? 'd-block' : 'd-none'} d-lg-block`}>
          <SideBar />
        </div>

        <div className="col">
          <AdminNavbar toggleSidebar={toggleSidebar} /> {/* Include Navbar for mobile */}
          <div className="py-3">
            <h2 className="text-start" style={{ fontSize: '1.5rem' }}>TrabahaDoor Dashboard</h2>
          </div>

          {/* KPI Cards */}
          <div className="row mb-4 mt-3 gx-1">
            <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <div className="p-3 bg-white border rounded shadow-sm d-flex align-items-center" style={{ height: '150px' }}>
                <div className="me-3">
                  <i className="fas fa-users fa-2x" style={{ color: '#007bff' }}></i> {/* Custom blue */}
                </div>
                <div>
                  <h4 className="mb-2">Job Seekers</h4>
                  <p className="kpi-value" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{jobSeekerCount}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <div className="p-3 bg-white border rounded shadow-sm d-flex align-items-center" style={{ height: '150px' }}>
                <div className="me-3">
                  <i className="fas fa-briefcase fa-2x" style={{ color: '#007bff' }}></i> {/* Custom blue */}
                </div>
                <div>
                  <h4 className="mb-2">Employers</h4>
                  <p className="kpi-value" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{employerCount}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <div className="p-3 bg-white border rounded shadow-sm d-flex align-items-center" style={{ height: '150px' }}>
                <div className="me-3">
                  <i className="fas fa-list fa-2x" style={{ color: '#007bff' }}></i> {/* Custom blue */}
                </div>
                <div>
                  <h4 className="mb-2">Job Listings</h4>
                  <p className="kpi-value" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{jobListingCount}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row gx-1">
            <div className="col-lg-7 col-md-12 mb-3">
              <div className="bg-white border rounded shadow-sm p-3 h-100">
                <BarChart />
              </div>
            </div>
            <div className="col-lg-5 col-md-12 mb-3">
              <div className="bg-white border rounded shadow-sm p-3 h-100">
                <TopHiringIndustries title="Top Hiring Industries" />
                <TopHiringCompanies title="Top Hiring Companies" />
              </div>
            </div>
          </div>
          <div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardAnalytics;

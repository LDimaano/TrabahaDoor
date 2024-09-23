import React, { useState, useEffect } from 'react';
import SideBar from '../../components/admin_sidepanel';
import BarChart from '../../components/barchart';
import TopHiringIndustries from '../../components/tophiringindustries';
import TopHiringCompanies from '../../components/tophiringcompanies';

function DashboardAnalytics() {
  // Assuming you fetch the counts from an API or database
  const [jobSeekerCount, setJobSeekerCount] = useState(0);
  const [employerCount, setEmployerCount] = useState(0);
  const [jobListingCount, setJobListingCount] = useState(0);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('http://localhost:5000/api/admin/dashboard-data');
        
        // Log response status and body
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('Fetched data:', data); // Log the fetched data
  
        setJobSeekerCount(data.jobSeekerCount);
        setEmployerCount(data.employerCount);
        setJobListingCount(data.jobListingCount);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    }
  
    fetchDashboardData();
  }, []);
  
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
            <h2 className="text-start" style={{ fontSize: '1.5rem' }}>TrabahaDoor Dashboard</h2>
          </div>

          {/* KPI Rectangles */}
          <div className="row mb-4 mt-3 gx-1">
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="p-3 bg-white border rounded shadow-sm d-flex align-items-center" style={{ height: '150px' }}>
                <div className="me-3">
                  <i className="fas fa-users fa-2x text-primary"></i>
                </div>
                <div>
                  <h4 className="mb-2">Job Seekers</h4>
                  <p className="kpi-value">{jobSeekerCount}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="p-3 bg-white border rounded shadow-sm d-flex align-items-center" style={{ height: '150px' }}>
                <div className="me-3">
                  <i className="fas fa-briefcase fa-2x text-success"></i>
                </div>
                <div>
                  <h4 className="mb-2">Employers</h4>
                  <p className="kpi-value">{employerCount}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="p-3 bg-white border rounded shadow-sm d-flex align-items-center" style={{ height: '150px' }}>
                <div className="me-3">
                  <i className="fas fa-list fa-2x text-warning"></i>
                </div>
                <div>
                  <h4 className="mb-2">Job Listings</h4>
                  <p className="kpi-value">{jobListingCount}</p>
                </div>
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
                <TopHiringIndustries title="Top Hiring Industries" />
                <TopHiringCompanies title="Top Hiring Companies" />
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

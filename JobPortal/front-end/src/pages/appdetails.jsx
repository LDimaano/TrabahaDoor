import React from 'react';
import SideBar from '../components/sidebar_appdetails';
import TopNav from '../components/topnav_appdetails';
import ApplicantDetails from '../components/app_details';
import ApplicantProfile from '../components/app_profile';
import ApplicantCard from '../components/app_card';

const CompanyDashboard = () => (
  <div className="d-flex">
    <SideBar />
    <div className="flex-fill p-4">
      <TopNav />
      <ApplicantDetails />
      <div className="d-flex">
        <div className="flex-fill me-4">
          <ApplicantProfile />
        </div>
        <ApplicantCard />
      </div>
    </div>
  </div>
);

export default CompanyDashboard;

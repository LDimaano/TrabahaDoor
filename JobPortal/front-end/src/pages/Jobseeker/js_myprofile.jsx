import React from 'react';
// import Sidebar from '../components/emp_side';
import Header from '../../components/jsheader';
import ApplicantProfile from '../../components/app_profile';
import ApplicantCard from '../../components/app_card';

const MyProfile = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 p-4 container">
        <section>
          {/* Main Content */}
          <h3 className="mb-4">My Profile</h3>
          <div className="d-flex">
            <div className="flex-fill me-4">
              <ApplicantProfile />
            </div>
            <ApplicantCard />
          </div>
        </section>
      </main>
    </div>
  );
};

export default MyProfile;

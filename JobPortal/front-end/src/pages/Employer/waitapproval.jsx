import React from 'react';
import Sidebar from '../../components/sidepanel_notapprove';
import 'bootstrap/dist/css/bootstrap.min.css';

const WaitForApproval = () => {
  return (
    <div className="d-flex flex-column flex-lg-row">
      <Sidebar />
      <div className="container p-4 flex-grow-1">
        <h1 className="text-center">Wait for Approval</h1>
        <div className="alert alert-info text-center" role="alert">
          Please wait for the admin approval.
        </div>
        <p className="text-center">
          For further questions, contact: 
          <a href="mailto:trabahadoor.sanjose@gmail.com"> trabahadoor.sanjose@gmail.com</a>
        </p>
      </div>
    </div>
  );
};

export default WaitForApproval;

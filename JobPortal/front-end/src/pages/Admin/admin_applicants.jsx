import React from 'react';
import SideBar from '../../components/admin_sidepanel'; // Import the sidebar

function AdminApplicants() {
  return (
    <div className="container-fluid">
      <div className="row flex-nowrap min-vh-100"> {/* Ensure sidebar takes full height */}
        {/* Sidebar */}
        <div className="col-lg-2 col-md-3 p-0 bg-light min-vh-100">
          <SideBar />
        </div>

        {/* Main content area (currently empty) */}
        <div className="col-lg-10 col-md-9 ms-4">
          {/* Content goes here */}
        </div>
      </div>
    </div>
  );
}

export default AdminApplicants;

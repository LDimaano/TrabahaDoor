import React from 'react';
import MenuItem from './menuitem';
import ProfileSection from './app_profilesec';

const SideBar = () => {
  const menuItems = [
    { icon: "fa-user", caption: "Profile" }, 
    { icon: "fa-users", caption: "All Applicants", active: true },
    { icon: "fa-briefcase", caption: "Job Listing" },
  ];

  return (
    <aside className="d-flex flex-column bg-light p-3" style={{ width: '250px' }}>
      <header className="d-flex align-items-center mb-4">
        <img src="/assets/TrabahaDoor_logo.png" alt="TrabahaDoor Logo" className="me-2" style={{ width: '50px' }} />
        <h1 className="fs-5">TrabahaDoor</h1>
      </header>
      <nav>
        {menuItems.map((item, index) => (
          <MenuItem key={index} {...item} />
        ))}
      </nav>
      <hr className="my-4" />
      <ProfileSection />
    </aside>
  );
};

export default SideBar;

import React from 'react';

const MenuItem = ({ icon, caption, active }) => (
  <div className={`menu-item ${active ? 'active' : ''}`}>
    <img src={icon} alt={caption} className="icon" />
    <span>{caption}</span>
  </div>
);

export default MenuItem;

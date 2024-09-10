import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const MenuItem = ({ icon, caption, active }) => (
  <div className={`d-flex align-items-center p-2 rounded ${active ? 'bg-primary text-white' : 'text-dark'}`}>
    <i className={`fas ${icon}`} style={{ width: '24px', fontSize: '24px' }}></i>
    <span>{caption}</span>
  </div>
);

export default MenuItem;

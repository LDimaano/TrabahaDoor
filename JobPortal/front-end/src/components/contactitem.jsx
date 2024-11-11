import React from 'react';

const ContactItem = ({ icon, label, value, className }) => (
  <div className={`d-flex align-items-center mb-2 ${className}`}>
    <div className="me-2" style={{ width: '24px' }}>
      {icon}
    </div>
    <span>{label}:</span>
    <span className="ms-2 text-break">{value}</span>
  </div>
);

export default ContactItem;

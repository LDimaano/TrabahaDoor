import React from 'react';

const ContactItem = ({ icon, label, value }) => (
  <div className="d-flex align-items-center mb-2">
    <div className="me-2" style={{ width: '24px' }}>
      {icon} {/* Directly render the icon component */}
    </div>
    <span>{label}:</span>
    <span className="ms-2">{value}</span>
  </div>
);

export default ContactItem;

import React from 'react';

const ContactItem = ({ icon, label, value }) => (
  <div className="d-flex align-items-center mb-2">
    <img src={icon} alt={`${label} icon`} className="me-2" style={{ width: '24px' }} />
    <span>{label}:</span>
    <span className="ms-2">{value}</span>
  </div>
);

export default ContactItem;

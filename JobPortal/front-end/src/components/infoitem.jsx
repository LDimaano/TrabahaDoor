import React from 'react';

const InfoItem = ({ label, value }) => (
  <div className="col-md-6 mb-3">
    <span className="fw-bold">{label}:</span> {value}
  </div>
);

export default InfoItem;

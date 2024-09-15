import React from 'react';

const PersonalInfo = ({ data }) => (
  <div>
    <h4>Personal Information</h4>
    <p><strong>Full Name:</strong> {data.fullName}</p>
    <p><strong>Date of Birth:</strong> {data.dateOfBirth}</p>
    <p><strong>Gender:</strong> {data.gender}</p>
    <p><strong>Address:</strong> {data.address}</p>
  </div>
);

export default PersonalInfo;

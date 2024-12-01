import React from 'react';
import Tag from './jstag';

const PersonalInfo = ({ data }) => (
  <div>
    <h4>Personal Information</h4>
    <p><strong>Full Name:</strong> {data.fullName}</p>
    <p><strong>Date of Birth:</strong> {data.dateOfBirth}</p>
    <p><strong>Gender:</strong> {data.gender}</p>
    <p><strong>Address:</strong> {data.address}</p>
    <p><strong>Industry:</strong> {data.industry}</p>
    <div className="d-flex flex-wrap" style={{ gap: '8px' }}>
      {data.educations.map((education, index) => (
        <Tag key={index} style={{ marginBottom: '8px' }}>{education}</Tag>
      ))}
    </div>
  </div>
);

export default PersonalInfo;

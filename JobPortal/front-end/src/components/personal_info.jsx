import React from 'react';
import Tag from './jstag';

const PersonalInfo = ({ data, educations }) => {
  console.log("the data received:", data);

  return (
    <div>
      <h4>Personal Information</h4>
      <p><strong>Full Name:</strong> {data.fullName}</p>
      <p><strong>Date of Birth:</strong> {data.dateOfBirth}</p>
      <p><strong>Gender:</strong> {data.gender}</p>
      <p><strong>Address:</strong> {data.address}</p>
      <p><strong>Industry:</strong> {data.industry}</p>
      <p><strong>Education:</strong> </p>
      {data.educations.map((education, index) => (
          <Tag key={index} style={{ marginBottom: '8px' }}>{education}</Tag>
        ))}
      </div>
  );
};


export default PersonalInfo;

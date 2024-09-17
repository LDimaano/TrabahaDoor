import React from 'react';

const PersonalInfo = ({ data }) => (
  <div>
    <h4>Company Information</h4>
    <p><strong>Company Name:</strong> {data.company_name}</p>
    <p><strong>Company Address:</strong> {data.company_address}</p>
    <p><strong>Industry:</strong> {data.industry}</p>
    <p><strong>Company Size:</strong> {data.company_size}</p>
    <p><strong>Founded Year:</strong> {data.founded_year}</p><hr/>
    <p><strong>Description:</strong> {data.description}</p>
  </div>
);

export default PersonalInfo;

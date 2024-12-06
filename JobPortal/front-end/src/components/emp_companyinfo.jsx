import React from 'react';

const PersonalInfo = ({ data }) => {
  // Parsing the company_size string into an array of numbers
  const companySize = data.company_size
    .replace(/[{}"]/g, '')    // Remove curly braces and quotes
    .split(',')               // Split by the comma
    .map(num => num.trim());  // Trim any extra spaces

  return (
    <div>
      <h4>Company Information</h4>
      <p><strong>Company Name:</strong> {data.company_name}</p>
      <p><strong>Company Address:</strong> {data.company_address}</p>
      <p><strong>Industry:</strong> {data.industry}</p>
      <p><strong>Company Size:</strong> {companySize[0]}-{companySize[1]} employees</p>
      <p><strong>Founded Year:</strong> {data.founded_year}</p><hr/>
      <p><strong>Description:</strong> {data.description}</p>
    </div>
  );
};

export default PersonalInfo;

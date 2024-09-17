import React from 'react';
import CompanyInfo from './emp_companyinfo';


const ApplicantProfile = ({ companyData }) => (
  <main className="bg-white p-4 border rounded">
    <div>
      <CompanyInfo data={companyData} />
    </div>
  </main>
);

export default ApplicantProfile;

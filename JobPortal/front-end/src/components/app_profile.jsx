import React from 'react';
import PersonalInfo from './personal_info';
import ProfessionalInfo from './prof_info';

const ApplicantProfile = ({ personalData, professionalData }) => (
  <main className="bg-white p-4 border rounded">
    <div>
      <PersonalInfo data={personalData} />
      <hr />
      <ProfessionalInfo data={professionalData} />
    </div>
  </main>
);

export default ApplicantProfile;

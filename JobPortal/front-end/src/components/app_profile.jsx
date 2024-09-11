import React from 'react';
import PersonalInfo from './personal_info';
import ProfessionalInfo from './prof_info';

const ApplicantProfile = () => (
  <main className="bg-white p-4 border rounded">
    <div>
      <PersonalInfo />
      <hr />
      <ProfessionalInfo />
    </div>
  </main>
);


export default ApplicantProfile;

import React from 'react';
import InfoItem from './infoitem';

const PersonalInfo = () => (
  <section>
    <h3>Personal Info</h3>
    <div className="row">
      <InfoItem label="Full Name" value="Jerome Bell" />
      <InfoItem label="Date of Birth" value="March 23, 1995 (26 y.o)" />
      <InfoItem label="Gender" value="Male" />
      <InfoItem label="Address" value="Brgy. Abra, San Jose, Batangas" />
    </div>
  </section>
);

export default PersonalInfo;

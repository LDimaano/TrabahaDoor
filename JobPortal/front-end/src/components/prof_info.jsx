import React from 'react';
import InfoItem from './infoitem';
import SkillSet from './skillset';

const ProfessionalInfo = () => (
  <section>
    <h3>Professional Info</h3>
    <div className="mb-3">
      <h4>About Me</h4>
      <p>
        As an elementary teacher, I believe in fostering a love for learning and helping each student reach their full potential. I am dedicated to creating a classroom community where every student feels valued, supported, and inspired to learn.
      </p>
    </div>
    <div className="row">
      <InfoItem label="Current Job" value="Elementary Teacher" />
      <InfoItem label="Work Experience" value="4 Years" />
      <SkillSet />
    </div>
  </section>
);

export default ProfessionalInfo;

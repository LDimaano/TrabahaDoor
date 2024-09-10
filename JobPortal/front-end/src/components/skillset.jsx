import React from 'react';

const SkillSet = () => (
  <div className="col-md-12">
    <span className="fw-bold">Skill set:</span>
    <div className="d-flex flex-wrap">
      {['English', 'Leadership', 'Teamwork'].map((skill, index) => (
        <span key={index} className="badge bg-secondary me-2">{skill}</span>
      ))}
    </div>
  </div>
);

export default SkillSet;

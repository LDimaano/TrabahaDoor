import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const SkillTags = ({ tags }) => (
  <div className="mb-3">
    {tags.map((tag, index) => (
      <span key={index} className="badge bg-primary me-2">{tag}</span>
    ))}
  </div>
);

export default SkillTags;

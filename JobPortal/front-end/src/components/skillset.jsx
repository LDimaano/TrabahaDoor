import React from 'react';
import Tag from './jstag'; // Make sure the path is correct

const SkillSet = ({ skills = [] }) => (
  <div className="skill-set">
    <h4>Skills</h4>
    <div className="tags-container">
      {skills.length > 0 ? (
        skills.map((skill, index) => (
          <Tag key={index}>{skill}</Tag>
        ))
      ) : (
        <span>No skills listed</span>
      )}
    </div>
  </div>
);

export default SkillSet;

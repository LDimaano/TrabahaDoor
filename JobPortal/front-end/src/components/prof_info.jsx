import React from 'react';
import SkillSet from './skillset';

const ProfessionalInfo = ({ data }) => (
  <section>
    <h3>Professional Info</h3>
    <div>
      <p><strong>Current Job:</strong> {data.currentJob}</p>

      <div>
        <strong>Work Experience:</strong>
        {data.workExperience.length > 0 ? (
          <ul>
            {data.workExperience.map((exp, index) => (
              <li key={index}>
                <p><strong>Job Title:</strong> {exp.job_title || 'Not Specified'}</p>
                <p><strong>Company:</strong> {exp.company || 'No Company Provided'}</p>
                <p><strong>Start Date:</strong> {exp.start_date || 'Not Provided'}</p>
                <p><strong>End Date:</strong> {exp.end_date || 'Not Provided'}</p>
                <p><strong>Description:</strong> {exp.description || 'No Description'}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No work experience provided</p>
        )}
      </div>
      <SkillSet skills={data.skills} />
    </div>
  </section>
);

export default ProfessionalInfo;

import React from 'react';
import SkillSet from './skillset';

const ProfessionalInfo = ({ data }) => (
  <section className="container my-4">
    <h3 className="mb-4">Professional Info</h3>
    <div className="row">
      {/* Current Job */}
      <div className="col-12 mb-3">
        <p><strong>Current Job:</strong> {data.currentJob || 'Not Specified'}</p>
      </div>

      {/* Work Experience */}
      <div className="col-12">
        <h5>Work Experience</h5>
        {data.workExperience.length > 0 ? (
          <ul className="list-unstyled">
            {data.workExperience.map((exp, index) => (
              <li key={index} className="mb-4">
                <div className="card p-3 shadow-sm">
                  <h6 className="card-title"><strong>Job Title:</strong> {exp.job_title || 'Not Specified'}</h6>
                  <p><strong>Company:</strong> {exp.company || 'No Company Provided'}</p>
                  <p><strong>Start Date:</strong> {exp.start_date || 'Not Provided'}</p>
                  <p><strong>End Date:</strong> {exp.end_date || 'Not Provided'}</p>
                  <p><strong>Description:</strong> {exp.description || 'No Description'}</p>
                  <p><strong>Salary Range:</strong> {exp.salary || 'Not Provided'}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No work experience provided</p>
        )}
      </div>
    </div>

    {/* Skills Section */}
    <div className="mt-4">
      <SkillSet skills={data.skills} />
    </div>
  </section>
);

export default ProfessionalInfo;

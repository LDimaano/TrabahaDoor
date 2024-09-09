import React from 'react';
import ProgressBar from './progressbar';
import Tag from './jstag';

const JobDetails = () => {
  const jobInfo = [
    { label: 'Job Posted On', value: 'April 1, 2024' },
    { label: 'Job Type', value: 'Full-Time' },
    { label: 'Salary', value: '20k-30k PHP' }
  ];
  const skills = ['Time Management', 'Writing', 'Communication', 'English', 'Teamwork'];

  return (
    <aside className="col-md-4">
      <section className="mb-4">
        <h2>About this role</h2>
        <ProgressBar current={5} total={10} />
        {jobInfo.map(({ label, value }) => (
          <div key={label} className="d-flex justify-content-between mb-2">
            <span>{label}</span>
            <span className="fw-bold">{value}</span>
          </div>
        ))}
      </section>
      <hr />
      <section className="mb-4">
        <h2>Categories</h2>
        <Tag color="secondary">Education</Tag>
      </section>
      <hr />
      <section>
        <h2>Required Skills</h2>
        <div className="d-flex flex-wrap">
          {skills.map((skill) => (
            <Tag key={skill}>{skill}</Tag>
          ))}
        </div>
      </section>
    </aside>
  );
};

export default JobDetails;

import React from 'react';

const JobContent = ({ jobdescription, responsibilities, qualifications }) => {
  return (
    <div className="col-md-8">
      <section className="mb-4">
        <h2>Description</h2>
        <p>{jobdescription}</p>
      </section>
      <section className="mb-4">
        <h2>Responsibilities</h2>
        <ul>
          {responsibilities.map((responsibility, index) => (
            <li key={index}>{responsibility}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Qualifications</h2>
        <ul>
          {qualifications.map((qualification, index) => (
            <li key={index}>{qualification}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default JobContent;

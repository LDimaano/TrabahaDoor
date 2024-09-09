import React from 'react';

const JobContent = () => {
  const responsibilities = [
    'Develop and implement lesson plans that meet the requirements of the curriculum',
    'Create a positive and inclusive classroom environment conducive to learning',
    'Deliver engaging and interactive lectures to students',
    'Assess student progress and provide constructive feedback',
    'Communicate regularly with parents to update them on their child\'s progress'
  ];
  const qualifications = [
    'Bachelor\'s degree in Education or related field (Master\'s degree preferred)',
    'Valid teaching license/certification',
    'Previous teaching experience preferred'
  ];

  return (
    <div className="col-md-8">
      <section className="mb-4">
        <h2>Description</h2>
        <p>
          We are seeking a dedicated and passionate teacher to join our team. The ideal candidate will be responsible for creating a positive learning environment, developing lesson plans, delivering engaging lectures, and assessing student progress. The teacher will also be responsible for fostering a supportive and inclusive classroom community.
        </p>
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

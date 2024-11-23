import React from 'react';

const JobContent = ({ jobdescription, responsibilities, qualifications }) => {
  return (
    <div className="col-md-8">
      <section className="mb-4">
        <h2 className="text-primary border-bottom pb-2">Description</h2>
        <p className="text-dark fs-5">{jobdescription}</p> 
      </section>
      <section className="mb-4">
        <h2 className="text-primary border-bottom pb-2">Responsibilities</h2>
        <ul className="list-group list-group-flush">
          {responsibilities.map((responsibility, index) => (
            <li key={index} className="list-group-item">
              <i className="me-2 fa fa-check-circle text-success"></i>
              <span className="text-dark">{responsibility}</span> {/* Changed text color to dark */}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-primary border-bottom pb-2">Qualifications</h2>
        <ul className="list-group list-group-flush">
          {qualifications.map((qualification, index) => (
            <li key={index} className="list-group-item">
              <i className="me-2 fa fa-check-circle text-success"></i>
              <span className="text-dark">{qualification}</span> {/* Changed text color to dark */}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default JobContent;

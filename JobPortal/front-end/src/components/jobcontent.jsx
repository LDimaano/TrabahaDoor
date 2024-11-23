import React from 'react';

const JobContent = ({ jobdescription, responsibilities, qualifications }) => {
  return (
    <div className="col-md-8">
      <section className="mb-4">
        <h2 className="text-dark border-bottom pb-2">Description</h2>
        <p className="text-muted fs-5">{jobdescription}</p>
      </section>
      <section className="mb-4">
        <h2 className="text-dark border-bottom pb-2">Responsibilities</h2>
        <div>
          {responsibilities.map((responsibility, index) => (
            <p key={index} className="mb-2">
              <i className="me-2 fa fa-check-circle text-success"></i>
              {responsibility}
            </p>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-dark border-bottom pb-2">Qualifications</h2>
        {/* Display qualifications as a single string */}
        <p className="text-muted fs-5">{qualifications}</p>
      </section>
    </div>
  );
};

export default JobContent;

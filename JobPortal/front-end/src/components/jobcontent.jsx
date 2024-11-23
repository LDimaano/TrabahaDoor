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
        {/* Display responsibilities as a single string */}
        <p className="text-muted fs-5">{responsibilities}</p>
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

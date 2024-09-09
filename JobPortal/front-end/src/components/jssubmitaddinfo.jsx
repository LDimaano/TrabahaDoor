import React from 'react';

const AdditionalInfo = () => {
  return (
    <div className="mb-3 text-start">
      <label htmlFor="additionalInfo" className="form-label">Additional information</label>
      <textarea
        id="additionalInfo"
        className="form-control"
        placeholder="Add a cover letter or anything else you want to share"
        aria-label="Additional information"
        rows="4"
      ></textarea>
      <div className="d-flex justify-content-between mt-2 text-muted">
        <span>Maximum 500 characters</span>
        <span>0 / 500</span>
      </div>
    </div>
  );
};

export default AdditionalInfo;

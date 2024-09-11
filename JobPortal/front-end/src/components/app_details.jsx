import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ApplicantDetails = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Goes back to the previous page
  };

  return (
    <section className="p-4 mb-4" style={{ backgroundColor: 'transparent' }}>
      <header className="d-flex align-items-center mb-3">
        <button
          onClick={handleBack}
          className="btn btn-link me-2"
          style={{ fontSize: '24px', color: 'black' }} // Set color to black
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h4 className="mb-0">Applicant List</h4>
      </header>
    </section>
  );
};

export default ApplicantDetails;

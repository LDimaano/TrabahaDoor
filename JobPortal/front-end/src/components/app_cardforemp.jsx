import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const ApplicantCard = ({ applicant }) => {
  const [currentPhoto] = useState(applicant.image);
  return (
    <aside className="bg-white p-4 border rounded shadow-sm">
      <header className="d-flex align-items-center mb-3">
        <div style={{ position: 'relative', marginRight: '15px' }}>
          <img
            src={currentPhoto} // Use the current photo state
            alt="Profile"
            className="img-fluid rounded-circle shadow-sm"
            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
          />
        </div>
        <div>
          <h2 className="mb-0">{applicant.companyname}</h2>
          <p className="text-muted">{applicant.contactperson}</p>
        </div>
      </header>
      <hr />
      <section>
        <h3>Contact</h3>
        <div className="d-flex align-items-center mb-2">
          <FontAwesomeIcon icon={faEnvelope} className="me-2" />
          <span>{applicant.email}</span>
        </div>
      </section>
    </aside>
  );
};

export default ApplicantCard;

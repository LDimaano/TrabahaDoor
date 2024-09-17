import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons'; // Import Font Awesome icons
import ContactItem from './contactitem';

const ApplicantCard = ({ applicant }) => {
  // Debugging: log applicant image and other data
  console.log('Applicant Image URL:', applicant.image);
  console.log('Applicant Data:', applicant);

  return (
    <aside className="bg-white p-4 border rounded">
      <header className="d-flex align-items-center mb-3">
        <img
          src={applicant.image} 
          alt="Profile"
          className="img-fluid rounded-circle"
          style={{ width: '150px', height: '150px' }}
        />
        <div>
          <h2 className="mb-0">{applicant.name}</h2>
          <p className="text-muted">{applicant.profession}</p>
        </div>
      </header>
      <hr />
      <section>
        <h3>Contact</h3>
        <ContactItem icon={<FontAwesomeIcon icon={faEnvelope} />} label="Email" value={applicant.email} />
        <ContactItem icon={<FontAwesomeIcon icon={faPhone} />} label="Phone" value={applicant.phone} />
      </section>
    </aside>
  );
};

export default ApplicantCard;

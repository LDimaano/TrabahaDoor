import React from 'react';
import ContactItem from './contactitem';

const ApplicantCard = () => (
  <aside className="bg-white p-4 border rounded">
    <header className="d-flex align-items-center mb-3">
      <img src="applicant-photo-url" alt="Jerome Bell" className="me-3" style={{ width: '100px', borderRadius: '50%' }} />
      <div>
        <h2 className="mb-0">Jerome Bell</h2>
        <p className="text-muted">Elementary Teacher</p>
      </div>
    </header>
    <hr />
    <section>
      <h3>Contact</h3>
      <ContactItem icon="email-icon-url" label="Email" value="email@example.com" />
      <ContactItem icon="phone-icon-url" label="Phone" value="+63 956 812 4293" />
    </section>
  </aside>
);

export default ApplicantCard;

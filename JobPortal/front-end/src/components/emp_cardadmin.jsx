import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faLink } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import ContactItem from './contactitem';

const ApplicantCard = ({ applicant }) => {
  const navigate = useNavigate();
  const [currentPhoto] = useState(applicant.image); // State to hold the current profile picture
  const { user_id } = useParams(); 
  
  const handleProfileUpdate = () => {
    navigate(`/admin_updateemp/${user_id}`);
  };

  const handleViewDocuments = () => {
    navigate(`/view_documents/${user_id}`);
  };

  return (
    <aside className="bg-white p-4 border rounded">
      <header className="d-flex align-items-center mb-3">
        <div style={{ position: 'relative' }}>
          <img
            src={currentPhoto} // Use the current photo state
            alt="Profile"
            className="img-fluid rounded-circle"
            style={{ width: '150px', height: '150px' }}
          />
        </div>
        <div className="ms-3">
          <h2 className="mb-0">{applicant.companyname}</h2>
          <p className="text-muted">{applicant.contactperson}</p>
        </div>
      </header>
      <hr />
      <section>
        <h3>Contact</h3>
        <ContactItem icon={<FontAwesomeIcon icon={faEnvelope} />} label="Email" value={applicant.email} />
        <ContactItem icon={<FontAwesomeIcon icon={faPhone} />} label="Phone" value={applicant.phone} />
        <ContactItem icon={<FontAwesomeIcon icon={faLink} />} label="Website" value={applicant.website} className="w-100" />
        <div className="d-flex mt-3">
          <button 
            className="btn btn-primary me-2" 
            onClick={handleProfileUpdate}
          >
            Update Profile
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleViewDocuments}
          >
            View Documents
          </button>
        </div>
      </section>
    </aside>
  );
};

export default ApplicantCard;

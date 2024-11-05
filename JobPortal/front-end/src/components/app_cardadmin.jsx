import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faPen } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';

const ApplicantCard = ({ applicant }) => {
  const navigate = useNavigate();
  const [currentPhoto] = useState(applicant.image); // State to hold the current profile picture
  const [setShowModal] = useState(false); // State to control profile picture modal visibility
  const { user_id } = useParams(); 
  const handleProfileUpdate = () => {
    navigate(`/admin_updatejs/${user_id}`);
  };

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
          <button 
            className="btn btn-light shadow-sm"
            style={{
              position: 'absolute',
              bottom: '5px',
              right: '5px',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              padding: '0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={() => setShowModal(true)} // Open modal on button click
          >
            <FontAwesomeIcon icon={faPen} size="sm" /> {/* Use a pencil icon */}
          </button>
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
        <div className="d-flex align-items-center mb-2">
          <FontAwesomeIcon icon={faPhone} className="me-2" />
          <span>{applicant.phone}</span>
        </div>
        
        <button 
          className="btn btn-primary mt-3" 
          onClick={handleProfileUpdate}
        >
          Update Profile
        </button>
      </section>
    </aside>
  );
};

export default ApplicantCard;

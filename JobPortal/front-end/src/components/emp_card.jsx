import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faLink, faPen } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import ContactItem from './contactitem';
import ProfilePictureModal from './profilepicturemodal';

const ApplicantCard = ({ applicant }) => {
  const navigate = useNavigate();
  const [currentPhoto, setCurrentPhoto] = useState(applicant.image); // State to hold the current profile picture
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const handleProfileUpdate = () => {
    const userId = sessionStorage.getItem('user_id');
    if (userId) {
      navigate(`/e_profileupdate/${userId}`);
    } else {
      console.error('User ID not found in session storage');
    }
  };

  // Callback to update the profile picture
  const handleUpdatePhoto = (newPhotoUrl) => {
    setCurrentPhoto(newPhotoUrl); // Update the current photo state
    setShowModal(false); // Close the modal
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
          <button 
            className="btn btn-light"
            style={{
              position: 'absolute',
              bottom: '5px',
              right: '5px',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              padding: '0',
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
        <ContactItem icon={<FontAwesomeIcon icon={faEnvelope} />} label="Email" value={applicant.email} />
        <ContactItem icon={<FontAwesomeIcon icon={faPhone} />} label="Phone" value={applicant.phone} />
        <ContactItem icon={<FontAwesomeIcon icon={faLink} />} label="Website" value={applicant.website} />
        <button 
          className="btn btn-primary mt-3" 
          onClick={handleProfileUpdate}
        >
          Update Profile
        </button>
      </section>
      {/* Render the modal if showModal is true */}
      {showModal && <ProfilePictureModal onClose={() => setShowModal(false)} onUpdate={handleUpdatePhoto} />}
    </aside>
  );
};

export default ApplicantCard;

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faLink } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import ContactItem from './contactitem';



const ApplicantCard = ({ applicant }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleProfileUpdate = () => {
    const userId = sessionStorage.getItem('user_id'); // Retrieve the userId from sessionStorage
    if (userId) {
        navigate(`/e_profileupdate/${userId}`); // Use template literal to include userId in the URL
    } else {
        console.error('User ID not found in session storage'); // Handle the case where userId is not found
    }
};


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
    </aside>
  );
};

export default ApplicantCard;

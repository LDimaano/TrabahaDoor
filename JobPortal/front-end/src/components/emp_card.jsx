import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faLink, faPen } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import ContactItem from './contactitem';
import ProfilePictureModal from './profilepicturemodal';

const ApplicantCard = ({ applicant }) => {
  const navigate = useNavigate();
  const [currentPhoto, setCurrentPhoto] = useState(applicant.image); // State to hold the current profile picture
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State to control delete confirmation modal visibility
  const [password, setPassword] = useState(''); // State to hold the entered password
  const [errorMessage, setErrorMessage] = useState('');  // State to hold error messages
  const [successMessage, setSuccessMessage] = useState(''); // State to hold success messages

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

  // Handle account deletion with password confirmation
  const handleDeleteAccount = () => {
    const userId = sessionStorage.getItem('user_id');
    if (!password) {
      setErrorMessage('Password is required to delete the account.');
      return;
    }

    fetch(`http://localhost:5000/api/employers/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, password }), // Send userId and password for confirmation
    })
      .then(response => {
        if (response.ok) {
          setSuccessMessage('Account deleted successfully.'); // Set success message
          setTimeout(() => {
            sessionStorage.clear();
            navigate('/'); // Navigate after showing the success message
          }, 2000); // Delay to show success message before redirecting
        } else {
          response.json().then(data => setErrorMessage(data.message || 'Failed to delete account.'));
        }
      })
      .catch(error => console.error('Error deleting account:', error));
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
        <button 
          className="btn btn-danger mt-3" 
          onClick={() => setShowDeleteModal(true)} // Show the delete confirmation modal
          style={{ width: '100%' }}
        >
          Delete Account
        </button>
      </section>

      {/* Render the modal if showModal is true */}
      {showModal && <ProfilePictureModal onClose={() => setShowModal(false)} onUpdate={handleUpdatePhoto} />}
      
      {showDeleteModal && (
        <div 
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '9999',
          }}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '400px',
              maxWidth: '90%',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h4 className="mb-3">Confirm Account Deletion</h4>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <p>Please enter your password to confirm.</p>
            <input
              type="password"
              className="form-control mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ced4da',
              }}
            />
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            {successMessage && <p className="text-success">{successMessage}</p>} 
            <div className="d-flex justify-content-end mt-4">
              <button 
                className="btn btn-secondary me-2" 
                onClick={() => setShowDeleteModal(false)}
                style={{ padding: '10px 20px' }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleDeleteAccount}
                style={{ padding: '10px 20px' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default ApplicantCard;

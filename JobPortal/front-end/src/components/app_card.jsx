import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faPen } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import ProfilePictureModal from './profilepicturemodal';

const ApplicantCard = ({ applicant }) => {
  const navigate = useNavigate();
  const [currentPhoto, setCurrentPhoto] = useState(applicant.image); 
  const [showModal, setShowModal] = useState(false); 
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  const [password, setPassword] = useState(''); 
  const [errorMessage, setErrorMessage] = useState(''); 
  const [successMessage, setSuccessMessage] = useState(''); 

  const handleProfileUpdate = () => {
    const userId = sessionStorage.getItem('user_id'); 
    if (userId) {
      navigate(`/js_profile_edit/${userId}`); 
    } else {
      console.error('User ID not found in session storage'); 
    }
  };

  // Callback to update the profile picture
  const handleUpdatePhoto = (newPhotoUrl) => {
    setCurrentPhoto(newPhotoUrl); 
    setShowModal(false); 
  };

  // Handle account deletion with password confirmation
  const handleDeleteAccount = () => {
    const userId = sessionStorage.getItem('user_id');
    if (!password) {
      setErrorMessage('Password is required to delete the account.');
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/api/jobseekers/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, password }), 
    })
      .then(response => {
        if (response.ok) {
          setSuccessMessage('Account deleted successfully.'); 
          setTimeout(() => {
            sessionStorage.clear();
            navigate('/'); 
          }, 2000); 
        } else {
          response.json().then(data => setErrorMessage(data.message || 'Failed to delete account.'));
        }
      })
      .catch(error => console.error('Error deleting account:', error));
  };

  return (
    <aside className="bg-white p-4 border rounded shadow-sm">
      <header className="d-flex align-items-center mb-3">
        <div style={{ position: 'relative', marginRight: '15px' }}>
          <img
            src={currentPhoto} 
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
            onClick={() => setShowModal(true)} 
          >
            <FontAwesomeIcon icon={faPen} size="sm" /> 
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
        
    
        <div className="button-container">
        <button
  className="btn btn-primary mt-3"
  onClick={handleProfileUpdate}
  style={{
    width: '100%', 
    padding: '6px 15px', 
    fontSize: '14px', 
    marginRight: '30px', 
    display: 'block', 
  }}
>
  Update Profile
</button>

  {showModal && <ProfilePictureModal onClose={() => setShowModal(false)} onUpdate={handleUpdatePhoto} />}
  
  <button
    className="btn btn-outline-secondary mt-3"
    onClick={() => setShowDeleteModal(true)} 
    style={{
      width: 'auto', 
      padding: '6px 15px', 
      fontSize: '14px', 
    }}
  >
    Deactivate
  </button>
</div>

      </section>

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
            <h4 className="mb-3">Confirm Account Deactivation</h4>
            <p>Are you sure you want to deactivate your account? your account can be reactivated once you log in again.</p>
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

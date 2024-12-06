import React, { useState } from 'react';

const ProfilePictureModal = ({ onClose, onUpdate }) => {
  const [photo, setPhoto] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setError('');

    if (!file) {
      console.error('No file selected');
      setError('No file selected');
      return;
    }

    const fileType = file.type;
    const fileSize = file.size;

    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(fileType)) {
      setError('Invalid file type. Only JPG, JPEG, and PNG are allowed.');
      return;
    }

    if (fileSize > 5 * 1024 * 1024) { // 5MB
      setError('File size exceeds 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const userId = sessionStorage.getItem('user_id');

    if (!selectedFile) {
      console.error('No file selected for upload');
      setError('No file selected for upload');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', selectedFile);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/update-profile-picture/${userId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      onUpdate(data.profilePictureUrl); // Call onUpdate to update the photo in the parent component
      onClose(); // Close the modal after successful upload
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setError('Error uploading profile picture. Please try again.');
    }
  };

  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Update Profile Picture</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input type="file" onChange={handleFileChange} accept=".jpg,.jpeg,.png" />
            {error && <div className="alert alert-danger mt-2">{error}</div>}
            {photo && <img src={photo} alt="Profile Preview" className="img-fluid mt-3" />}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureModal;

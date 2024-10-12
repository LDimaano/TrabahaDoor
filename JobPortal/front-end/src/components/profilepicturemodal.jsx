import React, { useState } from 'react';

const ProfilePictureModal = ({ onClose, onUpdate }) => {
  const [photo, setPhoto] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (!file) {
      console.error('No file selected');
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
            <input type="file" onChange={handleFileChange} />
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

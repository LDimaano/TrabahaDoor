import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import { Modal, Button } from 'react-bootstrap'; 

function EmployerProfileCreation() {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState(null);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [companyAddress, setCompanyAddress] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [foundedYear, setFoundedYear] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false); 

  useEffect(() => {
    fetchIndustries();
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const userId = window.location.pathname.split('/')[2];
  
    // Default profile picture URL
    const defaultProfilePictureUrl = "https://trabahadoor-bucket.s3.amazonaws.com/employer.png";
  
    if (!file) {
        console.log('No file selected, using default profile picture');
        setPhoto(defaultProfilePictureUrl); 
        return;
    }
  
    const formData = new FormData();
    formData.append('profilePicture', file);
  
    try {
        console.log('Uploading file...', file);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/upload-profile-picture/${userId}`, {
            method: 'POST',
            body: formData,
        });
  
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
  
        const data = await response.json();
        console.log('Uploaded image data:', data);
        setPhoto(data.profilePictureUrl); 
    } catch (error) {
        console.error('Error uploading profile picture:', error);
    }
};

  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); 
    const user_id = window.location.pathname.split('/')[2];

    // Default profile picture URL
    const defaultProfilePictureUrl = "https://trabahadoor-bucket.s3.amazonaws.com/employer.png";

    const profileData = {
      user_id,
      companyName,
      contactPerson,
      contactNumber,
      website,
      industry_id: industry?.value || '',
      companyAddress,
      companySize,
      foundedYear,
      description,
      profile_picture_url: photo || defaultProfilePictureUrl, 
    };

    console.log('Submitting profile data:', profileData);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employers/employer-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Profile created successfully:', data);

      setTimeout(() => {
        navigate(`/employerfiles/${user_id}`);
      }, 500);
    } catch (err) {
      console.error('Submission failed:', err);
      setError('Failed to submit the profile. Please try again.');
    }
  };

  const fetchIndustries = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/industries`);
      if (!response.ok) throw new Error('Failed to fetch industries');
      const data = await response.json();
      const industryOptions = data.map((industry) => ({
        value: industry.industry_id,
        label: industry.industry_name,
      }));
      setIndustryOptions(industryOptions);
    } catch (error) {
      console.error('Error fetching industries:', error);
      setError('Failed to load industries.');
    }
  };

  const handleShowModal = (e) => {
    e.preventDefault();
    setShowModal(true); 
  };

  const handleCloseModal = () => {
    setShowModal(false); 
  };

  const handleConfirmSubmit = () => {
    setShowModal(false); 
    handleSubmit();
  };

  return (
    <main className="container mt-4">
      <div className="mb-4">
        <h1 className="text-center">Create your Profile</h1>
        <h5 className="text-center">Let us know more about your company</h5>
      </div>
      <h3>Company Details</h3>
      <form onSubmit={handleShowModal}>
        <div className="mb-4 border p-4">
          <h3>Profile Photo</h3>
          <div className="mb-3">
            <label htmlFor="photo" className="form-label">Upload your profile photo</label>
            <input
              type="file"
              className="form-control"
              id="photo"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="companyName" className="form-label">Company Name <span className="text-danger">*</span></label>
          <input
            type="text"
            id="companyName"
            className="form-control"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="contactPerson" className="form-label">Contact Person <span className="text-danger">*</span></label>
            <input
              type="text"
              id="contactPerson"
              className="form-control"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="contactNumber" className="form-label">Contact Number <span className="text-danger">*</span></label>
            <input
              type="tel"
              id="contactNumber"
              className="form-control"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="website" className="form-label">Website <span className="text-danger">*</span></label>
            <input
              type="url"
              id="website"
              className="form-control"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="industry" className="form-label">Industry *</label>
          <Select
            id="industry"
            options={industryOptions}
            value={industry}
            onChange={setIndustry}
            placeholder="Select Industry"
            isClearable
            required
          />
        </div>
        <hr />
        <h3>Additional Information</h3>
        <div className="mb-3">
          <label htmlFor="companyAddress" className="form-label">Company Address <span className="text-danger">*</span></label>
          <input
            type="text"
            id="companyAddress"
            className="form-control"
            value={companyAddress}
            onChange={(e) => setCompanyAddress(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="companySize" className="form-label">Company Size</label>
          <input
            type="text"
            id="companySize"
            className="form-control"
            value={companySize}
            onChange={(e) => setCompanySize(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="foundedYear" className="form-label">Founded Year <span className="text-danger">*</span></label>
          <input
            type="text"
            id="foundedYear"
            className="form-control"
            value={foundedYear}
            onChange={(e) => setFoundedYear(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description <span className="text-danger">*</span></label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={400}
            required
          />
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-success float-end">Register</button>
        </div>
      </form>
      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to submit your profile?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmSubmit}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}

export default EmployerProfileCreation;

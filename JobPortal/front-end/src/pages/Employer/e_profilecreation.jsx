import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import { Modal, Button } from 'react-bootstrap'; // Importing Bootstrap Modal and Button

function EmployerProfileCreation() {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState('Tech Innovations Ltd');
  const [contactPerson, setContactPerson] = useState('Jane Doe');
  const [contactNumber, setContactNumber] = useState('+44 1245 678 901');
  const [website, setWebsite] = useState('http://www.techinnovations.com');
  const [industry, setIndustry] = useState(null);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [companyAddress, setCompanyAddress] = useState('123 Tech Lane, Silicon Valley');
  const [companySize, setCompanySize] = useState('500-1000 employees');
  const [foundedYear, setFoundedYear] = useState('2000');
  const [description, setDescription] = useState('Tech Innovations Ltd is a leading IT solutions provider specializing in software development and consulting.');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false); // For controlling the modal visibility

  useEffect(() => {
    fetchIndustries();
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const userId = sessionStorage.getItem('userId');
    console.log('User ID:', userId);

    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      console.log('Uploading file...', file);
      const response = await fetch(`http://localhost:5000/api/upload-profile-picture/${userId}`, {
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

  const handleSubmit = async () => {
    const user_id = sessionStorage.getItem('userId');
    console.log('Retrieved user_id:', user_id);

    if (!photo) {
      await handleFileChange({ target: { files: [document.getElementById('photo').files[0]] } });
    }

    if (!photo) {
      setError('Please upload a profile picture before submitting the form.');
      return;
    }

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
      profile_picture_url: photo,
    };

    console.log('Submitting profile data:', profileData);

    try {
      const response = await fetch('http://localhost:5000/api/employers/employer-profile', {
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
        navigate('/employerfiles');
      }, 500);
    } catch (err) {
      console.error('Submission failed:', err);
      setError('Failed to submit the profile. Please try again.');
    }
  };

  const fetchIndustries = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/industries');
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
    setShowModal(true); // Show the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
  };

  const handleConfirmSubmit = () => {
    setShowModal(false); // Hide modal and submit the form
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
              required
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

      {/* Modal */}
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

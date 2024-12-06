import React, { useState, useEffect } from 'react';
import { Range } from "react-range";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import { Modal, Button } from 'react-bootstrap'; 
import { ProgressBar } from 'react-bootstrap';
import TermsAndConditions from '../../components/termsandconditions';

function EmployerProfileCreation() {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState(null);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [companyAddress, setCompanyAddress] = useState('');
  const [companySizeRange, setCompanySizeRange] = useState([0, 100000]);
  const [foundedYear, setFoundedYear] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false); 

  const handleRangeChange = (values) => {
    console.log('Range changed to:', values); // Debugging
    setCompanySizeRange(values); // Update state
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const userId = window.location.pathname.split('/')[2];
  
    // Default profile picture URL
    const defaultProfilePictureUrl = "https://trabahadoor-bucket.s3.amazonaws.com/employer.png";

    setError(''); // Clear any previous error messages
    
  
    if (!file) {
        console.log('No file selected, using default profile picture');
        setPhoto(defaultProfilePictureUrl); 
        return;
    }

     // Validate file type
     const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
     if (!validFileTypes.includes(file.type)) {
       setError('Invalid file type. Only JPEG, JPG, and PNG are allowed.');
       return;
     }
 
     // Validate file size (5MB = 5 * 1024 * 1024 bytes)
     const maxSizeInBytes = 5 * 1024 * 1024;
     if (file.size > maxSizeInBytes) {
       setError('File size exceeds 5MB. Please select a smaller file.');
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

  const calculateProgress = () => {
    // Count the number of fields that are filled in
    const fields = [
      companyName,
      contactPerson,
      contactNumber,
      website,
      industry,
      companyAddress,
      foundedYear,
      description,
      photo
    ];

    const filledFields = fields.filter(field => field && field !== ''); // Filter out empty fields
    const progress = (filledFields.length / fields.length) * 100; // Calculate percentage

    return Math.round(progress); // Return the percentage as an integer
  };

  

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    const currentCompanySizeRange = [...companySizeRange]; // Ensure fresh reference
    console.log('Current companySizeRange on submit:', currentCompanySizeRange);

    const user_id = window.location.pathname.split('/')[2];

    const profileData = {
        user_id,
        companyName,
        contactPerson,
        contactNumber,
        website,
        industry_id: industry?.value || '',
        companyAddress,
        companySizeRange, // This should now work
        foundedYear,
        description,
        profile_picture_url: photo,
    };

    console.log('Submitting profile data:', profileData); // Debugging submission data

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

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleConfirmSubmit = () => {
    if (!isChecked) {
      setError("You must agree to the terms and conditions before submitting.");
      return;
    }
    setShowModal(false); 
    handleSubmit();
  };

  

  return (
    <main className="container mt-4">
      <div className="mb-4 d-flex align-items-center justify-content-center" style={{ marginTop: "45px" }}>
    {/* Logo Section */}
    <img
      src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`}
      alt="TrabahaDoor Logo"
      style={{ maxWidth: "80px", marginRight: "20px" }} // Adjust width and spacing
    />
    {/* Text Section */}
    <div>
      <h1 className="text-center">Create your Profile</h1>
      <h5 className="text-center">Let us know more about your company</h5>
      </div>
    </div>
      <div className="mb-4 mt-5"> {/* Add a top margin using mt-5 for more space */}
        {/* Title or Label for the Progress */}
        <h5 className="text-start text-muted">Sign-Up Progress</h5> {/* Left-align the text using text-start */}
        <p className="text-start text-muted">Fill out the information below to complete your profile.</p> {/* Left-align the description */}
        {/* Progress Bar */}
        <ProgressBar
          now={calculateProgress()} // Dynamically calculate progress
          label={`${calculateProgress()}%`}
          className="mb-4"
          variant="info" // You can change this variant for different colors
          style={{ height: '20px', borderRadius: '10px' }} // Custom height and rounded corners
        />
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
          {error && <div className="text-danger mt-2">{error}</div>}
          <small className="form-text text-muted">
            Accepted file types: JPEG, JPG, PNG. Maximum file size: 5MB.
          </small>
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
          <div className="col-md-6">
            <label htmlFor="industry" className="form-label">Industry <span className="text-danger">*</span></label>
            <Select
              id="industry"
              options={industryOptions}
              value={industry}
              onChange={setIndustry}
              isSearchable
              required
            />
          </div>
        </div>
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
        <div className="row mb-3">
        <div className="col-md-6">
      <label htmlFor="companySize" className="form-label">
        Company Size <span className="text-danger">*</span>
      </label>
      <div
        className="slider-container"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "10px",
        }}
      >
        {/* Minimum Label */}
        <small
          style={{
            fontSize: "0.9rem",
            color: "#6c757d",
          }}
        >
          0
        </small>

        {/* Slider */}
        <Range
          step={100}
          min={0}
          max={100000}
          values={companySizeRange}
          onChange={handleRangeChange}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: "6px",
                width: "100%",
                backgroundColor: "#ddd",
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: "16px",
                width: "16px",
                backgroundColor: "#007bff",
                borderRadius: "50%",
              }}
            />
          )}
        />

        {/* Maximum Label */}
        <small
          style={{
            fontSize: "0.9rem",
            color: "#6c757d",
          }}
        >
          100000
        </small>
      </div>

      {/* Current Value Display */}
      <input
        type="text"
        id="companySize"
        className="form-control"
        value={`${companySizeRange[0]}-${companySizeRange[1]} employees`}
        readOnly
      />
    </div>
          <div className="col-md-6">
            <label htmlFor="foundedYear" className="form-label">Founded Year <span className="text-danger">*</span></label>
            <select
              id="foundedYear"
              className="form-control"
              value={foundedYear}
              onChange={(e) => setFoundedYear(e.target.value)}
              required
            >
              <option value="">Select Year</option>
              {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => 1900 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Company Description <span className="text-danger">*</span></label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            required
          />
        </div>
        <div className="text-end">
          <button type="submit" className="btn btn-success">
            Submit Profile
          </button>
        </div>
      </form>
      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Terms and Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TermsAndConditions />
          <div className="form-check mt-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="termsCheckbox"
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label" htmlFor="termsCheckbox">
              I have read and agree to the terms and conditions.
            </label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleConfirmSubmit}
          disabled={!isChecked}>
            Confirm & Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}

export default EmployerProfileCreation;

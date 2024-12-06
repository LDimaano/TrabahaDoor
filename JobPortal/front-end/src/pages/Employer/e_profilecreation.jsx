import React, { useState, useEffect } from 'react';
import { Range } from "react-range";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import { Modal, Button } from 'react-bootstrap'; 
import { ProgressBar } from 'react-bootstrap';
import TermsAndConditions from '../../components/termsandconditions';
import Header from '../../components/header_unverified1';

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
       <Header style={{ fontSize: '3rem', fontWeight: 'bold' }} /> {/* Increased header size */}
    
    {/* Text Section */}
    <div className="text-center"> {/* Centers the content */}
  <h4>Create your Profile</h4> {/* Reduced font size */}
  <h5 className="text-muted">Let us know more about your company</h5>
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
          style={{
            height: '20px',
            borderRadius: '10px',
            position: 'sticky',
            top: '0', // Adjust to stick at the top of the container or viewport
            zIndex: '1000', // Ensure it's on top of other elements if necessary
          }}
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
          <p className="text-info text-muted">
            A professional company logo helps make a strong brand impression on potential candidates and can increase your chances of attracting top talent for the right opportunities!
          </p>
        </div>
     </div>
        <div className="mb-3">
          <label htmlFor="companyName" className="form-label">Company Name <span className="text-danger">*</span>{' '}
          <i
            className="far fa-question-circle" // Use "far" for a hollow circle
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Enter the company name registered for your business"
            style={{ cursor: 'pointer' }}
          ></i></label>
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
            <label htmlFor="contactPerson" className="form-label">Contact Person <span className="text-danger">*</span>{' '}
            <i
      className="far fa-question-circle" // Use "far" for a hollow circle
      data-bs-toggle="tooltip"
      data-bs-placement="right"
      title="Enter the full name of the person in charge of this account. Example: Juan Dela Cruz"
      style={{ cursor: 'pointer' }}
    ></i></label>
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
            <label htmlFor="contactNumber" className="form-label">Contact Number <span className="text-danger">*</span>{' '}
            <i
      className="far fa-question-circle" // Use "far" for a hollow circle
      data-bs-toggle="tooltip"
      data-bs-placement="right"
      title="Enter the company's active contact number, including the country code if applicable. Example: +63 234 567 8900. This will not be shared publicly"
      style={{ cursor: 'pointer' }}
    ></i></label>
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
            <label htmlFor="website" className="form-label">Website <span className="text-danger">*</span>{' '}
            <i
        className="far fa-question-circle" // Hollow question mark icon
        data-bs-toggle="tooltip"
        data-bs-placement="right"
        title="Enter the URL of your company's website to better showcase your company profile to candidates"
        style={{ cursor: 'pointer' }}
      ></i></label>
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
            <label htmlFor="industry" className="form-label">Industry <span className="text-danger">*</span>{' '}
            <i
      className="far fa-question-circle" // Hollow question mark icon
      data-bs-toggle="tooltip"
      data-bs-placement="right"
      title="Select your industry from the available options. This helps us match you with relevant job seekers."
      style={{ cursor: 'pointer' }}
    ></i></label>
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
          <label htmlFor="companyAddress" className="form-label">Company Address <span className="text-danger">*</span>{' '}
          <i
      className="far fa-question-circle" // Hollow question mark icon
      data-bs-toggle="tooltip"
      data-bs-placement="right"
      title="This information helps us verify your location."
      style={{ cursor: 'pointer' }}
    ></i></label>
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
        Company Size <span className="text-danger">*</span>{' '}
        <i
    className="far fa-question-circle" // Hollow question mark icon
    data-bs-toggle="tooltip"
    data-bs-placement="right"
    title="Please provide the number of employees in your company to help us categorize your business size."
    style={{ cursor: 'pointer', marginLeft: '5px' }}
  ></i>
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
          <label htmlFor="foundedYear" className="form-label">
    Founded Year <span className="text-danger">*</span>
    {' '}
 
  <i
    className="far fa-question-circle" // Hollow question mark icon
    data-bs-toggle="tooltip"
    data-bs-placement="right"
    title="Please provide the year your company was founded to help us better understand your business's history."
    style={{ cursor: 'pointer', marginLeft: '5px' }}
  ></i>
   </label>
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
        <div className="d-flex align-items-center">
  <label htmlFor="description" className="form-label">
    Company Description <span className="text-danger">*</span>
    {' '}
  <i
    className="far fa-question-circle" // Hollow question mark icon
    data-bs-toggle="tooltip"
    data-bs-placement="right"
    title="Provide a brief description of your company, including its mission, values, and goals."
    style={{ cursor: 'pointer', marginLeft: '5px' }}
  ></i>
  </label>
</div>

          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            required
          />
        </div>
        <div>
          <p>
            Note: Document submission is required to complete your registration.
          </p>
          <p>
            <a href="#" data-bs-toggle="modal" data-bs-target="#documentModal">Click here</a> <span> </span>
            to view the list of required documents.
          </p>
        </div>
        <div className="text-end">
          <button type="submit" className="btn btn-success">
            Submit Profile
          </button>
        </div>
      </form>
      {error && <div className="alert alert-danger mt-3">{error}</div>}


      <div className="modal fade" id="documentModal" tabIndex="-1" aria-labelledby="documentModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-lg" style="max-width: 80%;"> 
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="documentModalLabel">Required Documents</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <div className="row">
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">SEC Certificate</h5>
                <p className="card-text">This document verifies your business as a registered entity with the Securities and Exchange Commission (SEC).</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Business Permit</h5>
                <p className="card-text">This document shows your business is licensed to operate in your city or municipality.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">BIR Certificate</h5>
                <p className="card-text">This document confirms your registration with the Bureau of Internal Revenue (BIR) for tax purposes.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">POEA or DOLE License</h5>
                <p className="card-text">Required for recruitment agencies operating in the Philippines, ensuring compliance with the POEA/DOLE regulations.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Private Recruitment Agency License</h5>
                <p className="card-text">This license is essential for agencies that provide recruitment services to job seekers and employers.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Contract Sub Contractor Certificate</h5>
                <p className="card-text">This certificate verifies the legality of your business in engaging with sub-contractors.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>


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

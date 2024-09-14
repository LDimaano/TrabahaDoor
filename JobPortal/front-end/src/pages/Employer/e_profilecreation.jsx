import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function EmployerProfileCreation() {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState('Tech Innovations Ltd');
  const [contactPerson, setContactPerson] = useState('Jane Doe');
  const [contactNumber, setContactNumber] = useState('+44 1245 678 901');
  const [email, setEmail] = useState('contact@techinnovations.com');
  const [website, setWebsite] = useState('http://www.techinnovations.com');
  const [industry, setIndustry] = useState('Information Technology');
  const [companyAddress, setCompanyAddress] = useState('123 Tech Lane, Silicon Valley');
  const [companySize, setCompanySize] = useState('500-1000 employees');
  const [foundedYear, setFoundedYear] = useState('2000');
  const [description, setDescription] = useState('Tech Innovations Ltd is a leading IT solutions provider specializing in software development and consulting.');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const user_id = sessionStorage.getItem('userId');
    console.log('Retrieved user_id:', user_id);

    const profileData = {
      user_id,
      companyName,
      contactPerson,
      contactNumber,
      email,
      website,
      industry,
      companyAddress,
      companySize,
      foundedYear,
      description,
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

      // Navigate to login page after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000); // Adjust the delay as needed
    } catch (err) {
      console.error('Submission failed:', err);
      setError('Failed to submit the profile. Please try again.');
    }
  };

  const handleFileChange = (event) => {
    // Handle file change if needed
  };

  return (
    <main className="container mt-4">
  
      <div className="mb-4">
      <h1 className="text-center">Create your Profile</h1>
      <h5 className="text-center">Let us know more about your company</h5>
      </div>
      {/* <section className="mb-4">
        <h2>Profile Photo</h2>
        <p>This image will be shown publicly as your profile picture, it will help recruiters recognize you!</p>
        <div className="mb-3">
          <label htmlFor="profilePhotoUpload" className="form-label">
            <img src="http://b.io/ext_10-" alt="" style={{ height: '60px' }} />
            <p className="mt-2">Click to replace or drag and drop</p>
            <p className="text-muted">PNG, or JPG (max. 400 x 400px)</p>
          </label>
          <input
            type="file"
            id="profilePhotoUpload"
            accept="image/png, image/jpeg"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>
      </section> */}
      <section className="mb-4">
        <h3>Company Details</h3>
        <form onSubmit={handleSubmit}>
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
              <label htmlFor="email" className="form-label">Email <span className="text-danger">*</span></label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
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
            <label htmlFor="industry" className="form-label">Industry</label>
            <input
              type="text"
              id="industry"
              className="form-control"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
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
      </section>
    </main>
  );
}

export default EmployerProfileCreation;
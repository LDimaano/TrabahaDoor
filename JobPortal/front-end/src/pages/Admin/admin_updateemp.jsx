import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import { Modal, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

function EmployerProfileCreation() {
  const navigate = useNavigate();
  const { user_id } = useParams(); 
  
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
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchEmployerProfile = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employers/fetchemployer-profileforadmin/${user_id}`);
      if (!response.ok) throw new Error('Failed to fetch employer profile');
      const data = await response.json();

      console.log('Fetched Data:', data);
      console.log('Employer Data:', data.employer);

      setCompanyName(data.employer.company_name);
      setContactPerson(data.employer.contact_person);
      setContactNumber(data.employer.contact_number);
      setWebsite(data.employer.website);
      setIndustry({ value: data.employer.industry, label: data.employer.industryname });
      setCompanyAddress(data.employer.company_address);
      setCompanySize(data.employer.company_size);
      setFoundedYear(data.employer.foundedYear);
      setDescription(data.employer.description);
    } catch (error) {
      console.error('Error fetching employer profile:', error);
      setError('Failed to load employer profile.');
    }
  };

  useEffect(() => {
    fetchIndustries();
    fetchEmployerProfile();
  }, );

  const handleUpdate = async () => {
    const profileData = {
        user_id: user_id, // Ensure userId is defined correctly in your component
        companyName,
        contactPerson,
        contactNumber,
        website,
        industry_id: industry?.value || '', // Make sure industry is defined
        companyAddress,
        companySize,
        foundedYear,
        description,
    };

    try {
        // Update request to the API
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employers/employer-profile/${user_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        });

        // Check if the response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the response data
        const data = await response.json();
        console.log('Profile updated successfully:', data);

        setTimeout(() => {
            navigate('/admin_employers');
        }, 1000);
    } catch (err) {
        console.error('Update failed:', err);
        // Set error message in state to display to the user
        setError('Failed to update the profile. Please try again.');
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

  const handleConfirmUpdate = () => {
    setShowModal(false);
    handleUpdate();
  };

  return (
    <main className="container mt-4">
      <div className="mb-4">
        <h1 className="text-center">Update your Profile</h1>
        <h5 className="text-center">Keep your company details up-to-date</h5>
      </div>
      <h3>Company Details</h3>
      <form onSubmit={handleShowModal}>
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
          <button type="submit" className="btn btn-success float-end">Update Profile</button>
        </div>
      </form>
      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to update your profile?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={handleConfirmUpdate}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}

export default EmployerProfileCreation;

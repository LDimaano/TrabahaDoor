import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function ProfileCreation() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const profileData = {
      name,
      email,
      phone,
      bio,
      profilePicture,
    };

    console.log('Submitting profile data:', profileData);

    try {
      const response = await fetch('http://localhost:5000/api/profile', {
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
        navigate('/home');
      }, 3000);
    } catch (err) {
      console.error('Submission failed:', err);
      setError('Failed to submit the profile. Please try again.');
    }
  };

  const handleFileChange = (event) => {
    setProfilePicture(event.target.files[0]);
  };

  return (
    <main className="container mt-4">
      <nav className="navbar navbar-light bg-light mb-4">
        <a className="navbar-brand" href="/">TrabahaDoor</a>
        <div className="d-flex">
          <button className="btn btn-secondary me-2" onClick={() => navigate('/home')}>Back to homepage</button>
          <img src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`} alt="TrabahaDoor logo" className="d-inline-block align-top" style={{ height: '40px' }} />
        </div>
      </nav>
      <div className="mb-4">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a className="nav-link active" href="#">My Profile</a>
          </li>
        </ul>
      </div>
      <section className="mb-4">
        <h2>Profile Photo</h2>
        <p>This image will be shown publicly as your profile picture, it will help recruiters recognize you!</p>
        <div className="mb-3">
          <label htmlFor="profilePhotoUpload" className="form-label">
            <img src={profilePicture ? URL.createObjectURL(profilePicture) : "http://b.io/ext_10-"} alt="" style={{ height: '60px' }} />
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
      </section>
      <section className="mb-4">
        <h3>Profile Details</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name <span className="text-danger">*</span></label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
              <label htmlFor="phone" className="form-label">Phone <span className="text-danger">*</span></label>
              <input
                type="tel"
                id="phone"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="bio" className="form-label">Bio <span className="text-danger">*</span></label>
            <textarea
              id="bio"
              className="form-control"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={400}
              required
            />
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-success">Create Profile</button>
          </div>
        </form>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </section>
    </main>
  );
}

export default ProfileCreation;

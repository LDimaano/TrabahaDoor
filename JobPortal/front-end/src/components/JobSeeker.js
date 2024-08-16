import React, { useState, useEffect } from 'react';
import axios from 'axios';

function JobSeeker() {
  const [jobSeekers, setJobSeekers] = useState([]);
  const [formData, setFormData] = useState({
    resumeID: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    dob: '',
    gender: '',
    address: '',
    userID: ''
  });

  useEffect(() => {
    axios.get('/api/jobseekers')
      .then(response => setJobSeekers(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/jobseekers', formData)
      .then(response => {
        setJobSeekers([...jobSeekers, response.data]);
        setFormData({
          resumeID: '',
          fullName: '',
          phoneNumber: '',
          email: '',
          dob: '',
          gender: '',
          address: '',
          userID: ''
        }); // Reset form
      })
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h2>Job Seekers</h2>
      <form onSubmit={handleSubmit}>
        <input name="resumeID" value={formData.resumeID} placeholder="Resume ID" onChange={handleChange} required />
        <input name="fullName" value={formData.fullName} placeholder="Full Name" onChange={handleChange} required />
        <input name="phoneNumber" value={formData.phoneNumber} placeholder="Phone Number" onChange={handleChange} required />
        <input name="email" value={formData.email} placeholder="Email" onChange={handleChange} required />
        <input name="dob" value={formData.dob} placeholder="Date of Birth" onChange={handleChange} required />
        <input name="gender" value={formData.gender} placeholder="Gender" onChange={handleChange} required />
        <input name="address" value={formData.address} placeholder="Address" onChange={handleChange} required />
        <input name="userID" value={formData.userID} placeholder="User ID" onChange={handleChange} required />
        <button type="submit">Add Job Seeker</button>
      </form>
      <ul>
        {jobSeekers.map(js => (
          <li key={js.seekerid}>{js.fullname}</li>
        ))}
      </ul>
    </div>
  );
}

export default JobSeeker;

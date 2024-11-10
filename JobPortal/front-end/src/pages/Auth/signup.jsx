import React, { useState } from 'react';

function SignupForm({ openTermsModal, openPrivacyModal }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    usertype: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Registration successful! Please check your email to verify your account.');
      } else {
        setMessage(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error('Error during sign up:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label>User Type:</label>
        <select
          name="usertype"
          value={formData.usertype}
          onChange={handleChange}
          className="form-control"
          required
        >
          <option value="">Select User Type</option>
          <option value="jobseeker">Job Seeker</option>
          <option value="employer">Employer</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary">Sign Up</button>
      <button className="btn btn-link" onClick={openTermsModal}>Terms of Service</button>
      <button className="btn btn-link" onClick={openPrivacyModal}>Privacy Policy</button>

      {message && <p className="mt-3">{message}</p>}
    </form>
  );
}

export default SignupForm;

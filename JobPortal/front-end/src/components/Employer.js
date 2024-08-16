import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';



const Employer = () => {
  const [employers, setEmployers] = useState([]);
  const [newEmployer, setNewEmployer] = useState({
    companyName: '',
    location: '',
    industry: '',
    dateFounded: '',
    description: '',
    userID: ''
  });

  useEffect(() => {
    fetchEmployers();
  }, []);

  const fetchEmployers = async () => {
    try {
      const response = await axios.get('/api/employers');
      setEmployers(response.data);
    } catch (error) {
      console.error('Error fetching employers:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployer({ ...newEmployer, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/employers', newEmployer);
      fetchEmployers();
      setNewEmployer({
        companyName: '',
        location: '',
        industry: '',
        dateFounded: '',
        description: '',
        userID: ''
      });
    } catch (error) {
      console.error('Error creating employer:', error);
    }
  };

  return (
    <div>
      <h1>Employers</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="companyName"
          value={newEmployer.companyName}
          onChange={handleInputChange}
          placeholder="Company Name"
        />
        <input
          type="text"
          name="location"
          value={newEmployer.location}
          onChange={handleInputChange}
          placeholder="Location"
        />
        <input
          type="text"
          name="industry"
          value={newEmployer.industry}
          onChange={handleInputChange}
          placeholder="Industry"
        />
        <input
          type="date"
          name="dateFounded"
          value={newEmployer.dateFounded}
          onChange={handleInputChange}
          placeholder="Date Founded"
        />
        <input
          type="text"
          name="description"
          value={newEmployer.description}
          onChange={handleInputChange}
          placeholder="Description"
        />
        <input
          type="text"
          name="userID"
          value={newEmployer.userID}
          onChange={handleInputChange}
          placeholder="User ID"
        />
        <button type="submit">Add Employer</button>
      </form>

      <ul>
        {employers.map((employer) => (
          <li key={employer.EmployerID}>
            {employer.CompanyName} - {employer.Industry}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Employer;

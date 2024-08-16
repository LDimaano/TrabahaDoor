import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [jobSeekers, setJobSeekers] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [usersRes, jobSeekersRes, employersRes, jobsRes, applicationsRes] = await Promise.all([
        axios.get('/api/users'),
        axios.get('/api/jobseekers'),
        axios.get('/api/employers'),
        axios.get('/api/jobs'),
        axios.get('/api/applications')
      ]);

      setUsers(usersRes.data);
      setJobSeekers(jobSeekersRes.data);
      setEmployers(employersRes.data);
      setJobs(jobsRes.data);
      setApplications(applicationsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.UserID}>{user.Username} - {user.Email}</li>
        ))}
      </ul>

      <h2>Job Seekers</h2>
      <ul>
        {jobSeekers.map((seeker) => (
          <li key={seeker.SeekerID}>{seeker.FullName} - {seeker.Email}</li>
        ))}
      </ul>

      <h2>Employers</h2>
      <ul>
        {employers.map((employer) => (
          <li key={employer.EmployerID}>{employer.CompanyName} - {employer.Industry}</li>
        ))}
      </ul>

      <h2>Jobs</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.JobID}>{job.JobTitle} - {job.Description}</li>
        ))}
      </ul>

      <h2>Applications</h2>
      <ul>
        {applications.map((application) => (
          <li key={application.ApplicationID}>
            {application.JobID} - {application.SeekerID} - {application.Status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;

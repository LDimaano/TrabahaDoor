import React, { useState, useEffect } from 'react';
import JobListItem from './joblistitem';

function JobList() {
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch job listings from the backend
    const fetchJobListings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/joblistings'); // Adjust the URL if necessary
        const data = await response.json();
        setJobListings(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job listings:', error);
        setLoading(false);
      }
    };

    fetchJobListings();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="col-md-9">
      <h2>All Jobs</h2>
      <ul className="list-group">
        {jobListings.map((job) => (
          <JobListItem key={job.jobid} job={job} /> // Ensure JobListItem expects job_id
        ))}
      </ul>
    </div>
  );
}

export default JobList;

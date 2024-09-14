import React, { useState, useEffect } from 'react';
import JobListItem from './joblistitem';

function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/jobs/postedjobs') // Make sure this matches your backend route
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setJobs(data);
      })
      .catch((error) => console.error('Error fetching job listings:', error));
  }, []);
  

  return (
    <ul className="list-group">
      {jobs.map((job) => (
        <JobListItem key={job.job_id} job={job} />
      ))}
    </ul>
  );
}

export default JobList;

import React, { useState, useEffect } from 'react';
import JobListItem from './joblistitem';

function JobList({ filters = { employmentTypes: [], salaryRanges: [] }, searchQuery }) {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      let url = `http://localhost:5000/api/jobs/postedjobs`;
  
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append('jobTitle', searchQuery);
      }
  
      if (filters.industry) {  // Ensure industry is included if selected
        params.append('selectedIndustry', filters.industry);
      }
  
      if (params.toString()) {
        url += `?${params.toString()}`; // Append parameters to the URL
      }
  
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching job listings:', error);
      }
    };
  
    fetchJobs();
  }, [searchQuery, filters]); // Dependency array includes both searchQuery and filters
  
  const applyFilters = (jobs) => {
    const { employmentTypes, salaryRanges } = filters;
    const employmentTypesLower = employmentTypes.map(type => type.toLowerCase());
    const salaryRangesLower = salaryRanges.map(range => range.toLowerCase());

    return jobs.filter(job => {
      const jobType = job.jobtype ? job.jobtype.toLowerCase() : ''; // Updated to use jobtype
      const jobSalaryRange = job.salaryrange ? job.salaryrange.toLowerCase() : ''; // Match salaryrange

      return (
        (employmentTypesLower.length === 0 || employmentTypesLower.includes(jobType)) &&
        (salaryRangesLower.length === 0 || salaryRangesLower.includes(jobSalaryRange))
      );
    });
  };
  const applySearch = (jobs) => {
    if (!searchQuery) return jobs;
    return jobs.filter(job =>
      (job.job_title && job.job_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.industry_name && job.industry_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };
  
  
  const filteredJobs = applyFilters(jobs); // Apply filters first
  const searchedJobs = applySearch(filteredJobs); // Pass searchQuery prop to applySearch function


  return (
    <div>
      {searchedJobs.length === 0 ? (
        <p>No jobs available</p>
      ) : (
        <ul className="list-group">
          {searchedJobs.map((job) => (
            <JobListItem key={job.job_id} job={job} />
          ))}
        </ul>
      )}
    </div>
  );
}
export default JobList;

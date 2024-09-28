import React, { useState, useEffect } from 'react';
import JobListItem from './joblistitem';

function JobList({ filters = { employmentTypes: [], salaryRanges: [] }, searchQuery, isRecommended }) {
  const [jobs, setJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]); // State for recommended jobs
  const [userSkills, setUserSkills] = useState([]); // State for user skills

  // Fetch jobs and user skills when the component mounts or filters change
  useEffect(() => {
    const fetchJobs = async () => {
      let url = `http://localhost:5000/api/jobs/postedjobs`;

      const params = new URLSearchParams();
      if (searchQuery) {
        params.append('jobTitle', searchQuery);
      }

      if (filters.industry) {
        params.append('selectedIndustry', filters.industry);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
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

    const fetchUserSkills = async () => {
      const userId = sessionStorage.getItem('user_id');
      if (!userId) {
        console.error('No user_id found in sessionStorage');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/skills/${userId}`);
        if (!response.ok) {
          const errorDetails = await response.text(); // Get the error details
          throw new Error(`Failed to fetch user skills: ${errorDetails}`);
        }
        const skills = await response.json();
        setUserSkills(skills);
      } catch (error) {
        console.error('Error fetching user skills:', error);
      }
    };

    fetchJobs();
    fetchUserSkills();
  }, [searchQuery, filters]);

  // Fetch recommended jobs if needed
  useEffect(() => {
    if (isRecommended && userSkills.length > 0) {
      const fetchRecommendedJobs = async () => {
        console.log('User Skills:', userSkills); 
        try {
          const response = await fetch(`http://localhost:5000/api/recommend`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ skills: userSkills }), 
            // Pass the user skills for recommendations
          });
      
          if (!response.ok) {
            const errorDetails = await response.text(); // Get the response error message
            throw new Error(`Failed to fetch recommended jobs: ${errorDetails}`);
          }
      
          const recommendedJobsData = await response.json();
          setRecommendedJobs(recommendedJobsData);
        } catch (error) {
          console.error('Error fetching recommended jobs:', error);
        }
      };
      
      fetchRecommendedJobs();
    }
  }, [isRecommended, userSkills]);

  // Apply filters to all jobs
  const applyFilters = (jobs) => {
    const { employmentTypes, salaryRanges } = filters;
    const employmentTypesLower = employmentTypes.map(type => type.toLowerCase());
    const salaryRangesLower = salaryRanges.map(range => range.toLowerCase());

    return jobs.filter(job => {
      const jobType = job.jobtype ? job.jobtype.toLowerCase() : '';
      const jobSalaryRange = job.salaryrange ? job.salaryrange.toLowerCase() : '';

      return (
        (employmentTypesLower.length === 0 || employmentTypesLower.includes(jobType)) &&
        (salaryRangesLower.length === 0 || salaryRangesLower.includes(jobSalaryRange))
      );
    });
  };

  // Apply search filter to jobs
  const applySearch = (jobs) => {
    if (!searchQuery) return jobs;
    return jobs.filter(job =>
      (job.job_title && job.job_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.industry_name && job.industry_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  // Apply filters and search to jobs
  const filteredJobs = applyFilters(jobs);
  const searchedJobs = applySearch(filteredJobs);

  return (
    <div>
      {isRecommended ? (
        <>
          <h3>Recommended Jobs</h3>
          {recommendedJobs.length === 0 ? (
            <p>No recommended jobs available</p>
          ) : (
            <ul className="list-group">
              {recommendedJobs.map((job) => (
                <JobListItem key={job.job_id} job={job} />
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          <h3>All Jobs</h3>
          {searchedJobs.length === 0 ? (
            <p>No jobs available</p>
          ) : (
            <ul className="list-group">
              {searchedJobs.map((job) => (
                <JobListItem key={job.job_id} job={job} />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default JobList;

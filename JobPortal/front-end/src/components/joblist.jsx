import React, { useState, useEffect } from 'react';
import JobListItem from './joblistitem';

function JobList({ filters = { employmentTypes: [], salaryRanges: [] }, searchQuery, isRecommended }) {
  const [jobs, setJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]); // State for recommended jobs
  const [userSkills, setUserSkills] = useState([]); // State for user skills

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
      // Fetch user skills using a valid API endpoint
      const userId = sessionStorage.getItem('user_id'); // Ensure user_id is stored in session storage
      const response = await fetch(`http://localhost:5000/api/jobseekers/skills/${userId}`); // Pass user_id
      if (!response.ok) {
        console.error('Failed to fetch user skills:', response.status);
        return;
      }
      const skills = await response.json();
      setUserSkills(skills);

      // Now call the recommendation API with the skills
      const recommendResponse = await fetch('http://localhost:5000/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ skills }), // Send user skills
      });

      if (recommendResponse.ok) {
        const recommendations = await recommendResponse.json();
        setRecommendedJobs(recommendations);
      } else {
        console.error('Error fetching recommendations:', recommendResponse.status);
      }
    };

    fetchJobs();
    fetchUserSkills(); // Fetch skills when the component mounts
  }, [searchQuery, filters]);

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

  const applySearch = (jobs) => {
    if (!searchQuery) return jobs;
    return jobs.filter(job =>
      (job.job_title && job.job_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.industry_name && job.industry_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

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

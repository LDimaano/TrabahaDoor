import React, { useState, useEffect } from 'react';
import JobListItem from './joblistitem';

function JobList({ filters = { employmentTypes: [], salaryRanges: [] }, searchQuery, isRecommended }) {
  const [jobs, setJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  // Fetch jobs when the component mounts or filters/searchQuery change
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

    fetchJobs();
  }, [searchQuery, filters]);

  // Fetch user skills and profile when the component mounts
  useEffect(() => {
    const fetchUserSkills = async () => {
      const userId = sessionStorage.getItem('user_id');
      if (!userId) {
        console.error('No user_id found in sessionStorage');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/getskills/${userId}`);
        if (!response.ok) {
          const errorDetails = await response.text();
          throw new Error(`Failed to fetch user skills: ${errorDetails}`);
        }
        const skills = await response.json();
        const skillNames = skills.map(skill => skill.skill_name);
        setUserSkills(skillNames);
      } catch (error) {
        console.error('Error fetching user skills:', error);
      }
    };

    const fetchUserProfile = async () => {
      const userId = sessionStorage.getItem('user_id');
      if (!userId) {
        console.error('No user_id found in sessionStorage');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/jobseekers/user-info`, {
          method: 'GET',
          credentials: 'include'
        });

        if (!response.ok) {
          const errorDetails = await response.text();
          throw new Error(`Failed to fetch user profile: ${errorDetails}`);
        }

        const profile = await response.json();
        setUserProfile(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserSkills();
    fetchUserProfile();
  }, []);

  // Fetch recommended jobs if needed
  useEffect(() => {
    console.log('isRecommended:', isRecommended);
    console.log('userSkills:', userSkills);
    console.log('userProfile:', userProfile);

    if (isRecommended && userSkills.length > 0 && userProfile && userProfile.industryName) {
      const fetchRecommendedJobs = async () => {
        console.log('Fetching recommended jobs...');

        try {
          const response = await fetch(`http://localhost:5000/api/recommend`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              skills: userSkills,
              industry: userProfile.industryName,
              salaryRange: userProfile.salaryRange || null,
            }),
          });

          if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`Failed to fetch recommended jobs: ${errorDetails}`);
          }

          const recommendedJobsData = await response.json();
          console.log('Recommended Jobs Data:', recommendedJobsData);
          setRecommendedJobs(recommendedJobsData.recommendations || []);
        } catch (error) {
          console.error('Error fetching recommended jobs:', error);
        }
      };

      fetchRecommendedJobs();
    } else {
      console.log('Skipping recommended jobs fetch:', {
        isRecommended,
        userSkillsLength: userSkills.length,
        userProfile,
      });
    }
  }, [isRecommended, userSkills, userProfile]);

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

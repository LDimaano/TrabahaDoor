import React, { useState, useEffect } from 'react';
import JobListItem from './joblistitem';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../css/pagination.css'; // Ensure you import the custom CSS

function JobList({ filters = { employmentTypes: [], salaryRanges: [] }, searchQuery, searchType, isRecommended }) {
  const [jobs, setJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  useEffect(() => {
    const fetchJobs = async () => {
      let url = `${process.env.REACT_APP_API_URL}/api/jobs/postedjobs`;
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append('searchQuery', searchQuery);
      }
      if (filters && filters.industry) {
        params.append('selectedIndustry', filters.industry);
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      console.log('Fetching jobs with URL:', url);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setJobs(data || []);
      } catch (error) {
        console.error('Error fetching job listings:', error);
      }
    };
    fetchJobs();
  }, [searchQuery, searchType, filters]);

  useEffect(() => {
    const fetchUserSkills = async () => {
      const userId = sessionStorage.getItem('user_id');
      if (!userId) {
        console.error('No user_id found in sessionStorage');
        return;
      }
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/getskills/${userId}`);
        if (!response.ok) {
          const errorDetails = await response.text();
          throw new Error(`Failed to fetch user skills: ${errorDetails}`);
        }
        const skills = await response.json();
        const skillNames = skills.map(skill => skill.skill_name);
        setUserSkills(skillNames || []);
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
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobseekers/user-info/${userId}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          const errorDetails = await response.text();
          throw new Error(`Failed to fetch user profile: ${errorDetails}`);
        }
        const profile = await response.json();
        setUserProfile(profile || null);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserSkills();
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (isRecommended && userSkills.length > 0 && userProfile && userProfile.industryName) {
      const fetchRecommendedJobs = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recommend`, {
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
          setRecommendedJobs(recommendedJobsData.recommendations || []);
        } catch (error) {
          console.error('Error fetching recommended jobs:', error);
        }
      };
      fetchRecommendedJobs();
    }
  }, [isRecommended, userSkills, userProfile]);

  const applyFilters = (jobs) => {
    if (!jobs || jobs.length === 0) return [];
    const { employmentTypes, salaryRanges } = filters;
    const employmentTypesLower = (employmentTypes || []).map(type => type.toLowerCase());
    const salaryRangesLower = (salaryRanges || []).map(range => range.toLowerCase());
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
    if (!jobs || jobs.length === 0 || !searchQuery) return jobs;
    if (searchType === "jobTitle") {
      return jobs.filter(job =>
        job.job_title && job.job_title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (searchType === "companyName") {
      return jobs.filter(job =>
        job.company_name && job.company_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return jobs;
  };

  const filteredJobs = applyFilters(jobs);
  const searchedJobs = applySearch(filteredJobs);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = isRecommended ? recommendedJobs.slice(indexOfFirstJob, indexOfLastJob) : searchedJobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalJobs = isRecommended ? recommendedJobs.length : searchedJobs.length;
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalJobs / jobsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      {isRecommended ? (
        <>
          <h3>Recommended Jobs</h3>
          {currentJobs.length === 0 ? (
            <p>No recommended jobs available</p>
          ) : (
            <ul className="list-group">
              {currentJobs.map((job) => (
                <JobListItem key={job.job_id} job={job} />
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          <h3>All Jobs</h3>
          {currentJobs.length === 0 ? (
            <p>No jobs available</p>
          ) : (
            <ul className="list-group">
              {currentJobs.map((job) => (
                <JobListItem key={job.job_id} job={job} />
              ))}
            </ul>
          )}
        </>
      )}
      <nav className="pagination-container">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <a onClick={() => paginate(currentPage - 1)} href="#" className="page-link">
              &laquo;
            </a>
          </li>
          {pageNumbers.map(number => (
            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
              <a onClick={() => paginate(number)} href="#" className="page-link">
                {number}
              </a>
            </li>
          ))}
          <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
            <a onClick={() => paginate(currentPage + 1)} href="#" className="page-link">
              &raquo;
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default JobList;

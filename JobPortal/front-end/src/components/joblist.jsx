import React, { useState, useEffect } from 'react';
import JobListItem from './joblistitem';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../css/pagination.css';

function JobList({ filters = { employmentTypes: [], salaryRanges: [] }, searchQuery, searchType, isRecommended }) {
  const [jobs, setJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [userEducations, setUserEducations] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  useEffect(() => {
    const fetchJobs = async () => {
      let url = `${process.env.REACT_APP_API_URL}/api/jobs/postedjobs`;
      const params = new URLSearchParams();
      if (searchQuery) params.append('searchQuery', searchQuery);
      if (filters && filters.industry) params.append('selectedIndustry', filters.industry);
      if (params.toString()) url += `?${params.toString()}`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
      if (!userId) return;
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/getskills/${userId}`);
        if (!response.ok) throw new Error(await response.text());
        const skills = await response.json();
        setUserSkills(skills.map((skill) => skill.skill_name) || []);
      } catch (error) {
        console.error('Error fetching user skills:', error);
      }
    };

    const fetchUserEducations = async () => {
      const userId = sessionStorage.getItem('user_id');
      if (!userId) return;
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/geteducation/${userId}`);
        if (!response.ok) throw new Error(await response.text());
        const educations = await response.json();
        setUserEducations(educations.map((education) => education.education_name) || []);
      } catch (error) {
        console.error('Error fetching user educations:', error);
      }
    };

    const fetchUserProfile = async () => {
      const userId = sessionStorage.getItem('user_id');
      if (!userId) return;
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobseekers/user-info/${userId}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) throw new Error(await response.text());
        setUserProfile((await response.json()) || null);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserSkills();
    fetchUserEducations();
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (isRecommended && userSkills.length > 0 && userProfile && userProfile.industryName) {
      const fetchRecommendedJobs = async () => {
        try {
          const requestBody = {
            skills: userSkills,
            industry: userProfile.industryName,
            salaryRange: userProfile.salaryRange || null,
            jobTitles: userProfile.jobTitles || [],
            education: userEducations,

          };

          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recommend`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          });

          if (!response.ok) throw new Error(await response.text());

          const recommendedJobsData = await response.json();
          setRecommendedJobs(recommendedJobsData.recommendations || []);
        } catch (error) {
          console.error('Error fetching recommended jobs:', error);
        }
      };
      fetchRecommendedJobs();
    }
  }, [isRecommended, userSkills, userEducations, userProfile]);

  const applyFilters = (jobs) => {
    if (!jobs || jobs.length === 0) return [];
    const { employmentTypes, salaryRanges } = filters;
    const employmentTypesLower = (employmentTypes || []).map((type) => type.toLowerCase());
    const salaryRangesLower = (salaryRanges || []).map((range) => range.toLowerCase());
    return jobs.filter((job) => {
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
    const lowerCaseQuery = searchQuery.toLowerCase();
    return jobs.filter(
      (job) =>
        (job.job_title && job.job_title.toLowerCase().includes(lowerCaseQuery)) ||
        (job.company_name && job.company_name.toLowerCase().includes(lowerCaseQuery))
    );
  };

  const filteredJobs = applyFilters(jobs);
  const searchedJobs = applySearch(filteredJobs);

  const filteredRecommendedJobs = applySearch(applyFilters(recommendedJobs));

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = isRecommended
    ? filteredRecommendedJobs.slice(indexOfFirstJob, indexOfLastJob)
    : searchedJobs.slice(indexOfFirstJob, indexOfLastJob);

  const totalJobs = isRecommended ? filteredRecommendedJobs.length : searchedJobs.length;
  const totalPages = Math.ceil(totalJobs / jobsPerPage);
  const maxPagesVisible = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesVisible - 1);

  if (endPage - startPage + 1 < maxPagesVisible) {
    startPage = Math.max(1, endPage - maxPagesVisible + 1);
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      {isRecommended ? (
        <>
          <h3>Recommended Jobs</h3>
          <span className="text-muted d-block mb-3" style={{ fontSize: '0.9rem' }}>
            The match percentages shown represent the degree of similarity between job seekers and job listings based on the provided information. 
            Higher percentages indicate a closer match between the user’s profile and the job criteria, but these percentages do not guarantee a perfect fit.
          </span>
          {currentJobs.length === 0 ? (
            <p>No recommended jobs available</p>
          ) : (
            <ul className="list-group">
              {currentJobs.map((job) => (
                <JobListItem key={job.job_id} job={job} isRecommended={isRecommended} />
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
          {currentPage > 1 && (
            <li className="page-item">
              <a onClick={() => paginate(currentPage - 1)} href="#!" className="page-link">
                {'<<'}
              </a>
            </li>
          )}
          {pageNumbers.map((number) => (
            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
              <a onClick={() => paginate(number)} href="#!" className="page-link">
                {number}
              </a>
            </li>
          ))}
          {currentPage < totalPages && (
            <li className="page-item">
              <a onClick={() => paginate(currentPage + 1)} href="#!" className="page-link">
                {'>>'}
              </a>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );  
}

export default JobList;

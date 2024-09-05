import React, { useState, useEffect } from 'react';
import styles from '../css/home_jobseeker.module.css';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('useEffect triggered'); // Log when useEffect runs
    const fetchEmail = async () => {
      try {
        console.log('Fetching email'); // Log before fetch
        const response = await fetch('/api/user-info');
        console.log('Response received'); // Log after fetch

        if (response.ok) {
          const data = await response.json();
          console.log('Email fetched:', data.email); // Log email data
          setEmail(data.email);
        } else {
          console.error('Failed to fetch email:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching email:', error);
      }
    };

    fetchEmail();
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        <div className={styles.logo}>
          <img 
            src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`} 
            alt="TrabahaDoor Logo" 
            className={styles.logoImage} 
          />
          <span className={styles.logoText}>TrabahaDoor</span>
          <span className={styles.welcomeText}>Welcome, {email}</span>
        </div>
        <ul className={styles.navMenu}>
          <li className={styles.navItem}>
            <a href="#" className={styles.navLink}>Find Jobs</a>
            <div className={styles.activeIndicator} />
          </li>
          <li className={styles.navItem}>
            <a href="#" className={styles.navLink}>Browse Companies</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

function SearchForm() {
  return (
    <section className={styles.searchForm}>
      <form className={styles.searchBar}>
        <div className={styles.inputContainer}>
          <img 
            loading="lazy" 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/e7f5ae91f74a0bbff814182823ec89164ff92f1d17811cfd85ad807eb891d404?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
            alt="" 
            className={styles.inputImage} 
          />
          <div className={styles.inputGroup}>
            <label htmlFor="jobTitleInput" className="visually-hidden"></label>
            <input
              type="text"
              id="jobTitleInput"
              placeholder="Job title or keyword"
              aria-label="Job title or keyword"
              className={styles.select}
            />
            {/* <div className={styles.divider}></div> */}
          </div>
        </div>
        
        <div className={styles.inputContainer}>
          <div className={styles.inputGroup}>
              <label htmlFor="industrySelect" className="visually-hidden"></label>
              <select
              id="industrySelect"
              aria-label="Industry"
              className={styles.select}
              >
              <option value="">Select Industry</option>
              <option value="agriculture">Agriculture</option>
              <option value="tourism">Tourism</option>
              <option value="marketing">Marketing</option>
              <option value="business">Business</option>
              <option value="hr">Human Resource</option>
              <option value="healthcare">Healthcare</option>
              <option value="engineering">Engineering</option>
              <option value="technology">Technology</option>
              </select>
          </div>
        </div>

        <button type="submit" className={styles.searchButton}>Search</button>
      </form>
    </section>
  );
}

function FilterSection() {
  const employmentTypes = ['Full-time', 'Part-Time', 'Remote', 'Internship', 'Contract'];
  const categories = ['Agriculture', 'Tourism', 'Marketing', 'Business', 'Human Resource', 'Healthcare', 'Engineering', 'Technology'];
  const salaryRanges = ['$700 - $1000', '$1000 - $1500', '$1500 - $2000', '$3000 or above'];

  return (
    <div className={styles.filterSection}>
      <FilterGroup title="Type of Employment" items={employmentTypes} />
      <FilterGroup title="Categories" items={categories} />
      <FilterGroup title="Salary Range" items={salaryRanges} />
    </div>
  );
}

function FilterGroup({ title, items }) {
  return (
    <div className={styles.filterGroup}>
      <h3 className={styles.filterTitle}>{title}</h3>
      <img 
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/0535a47d11c9869cd543561cec9c0500b285f25574c94bba865051e75300ca66?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
        alt="" 
        className={styles.filterToggle} 
      />
      {items.map((item, index) => (
        <label key={index} className={styles.filterOption}>
          <input type="checkbox" className={styles.filterCheckbox} />
          <span className={styles.filterLabel}>{item}</span>
        </label>
      ))}
    </div>
  );
}

const jobListings = [
  {
    id: 1,
    title: 'Accounting Staff',
    company: 'ACE Hardware Phils., INC.',
    location: 'Abra, San Jose',
    type: 'Full-Time',
    category: 'Business',
    logo: 'https://cdn.builder.io/api/v1/image/assets/TEMP/9425037a463a3276bdd0dbe0bb7a97e94562d9cb4cf54c89ff3e657f8ba47003?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975',
    applicants: 5,
    capacity: 10
  },
  {
    id: 2,
    title: 'Customer Associate',
    company: 'LBC Express INC.',
    location: 'San Jose Batangas',
    type: 'Full-Time',
    categories: ['Marketing', 'Design'],
    logo: 'https://cdn.builder.io/api/v1/image/assets/TEMP/7e9a9c379bf2a5338cc9fde75045b1de52a97535c4bf64bfa94b37a227b37a57?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975',
    applicants: 4,
    capacity: 5
  },
  // Add more job listings here
];

function JobList() {
  return (
    <section className={styles.jobListContainer}>
      <div className={styles.jobListHeader}>
        <div>
          <h2 className={styles.jobListTitle}>All Jobs</h2>
          <p className={styles.jobListSubtitle}>Showing 73 results</p>
        </div>
        <div className={styles.jobListControls}>
          <div className={styles.sortControl}>
            <span className={styles.sortLabel}>Sort by:</span>
            <div className={styles.sortSelector}>
              <span>Most relevant</span>
              <img 
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/0ecb1061ad2d3f67351803a0460e833050feee5cac983333e77bfe4ca63b6c8d?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
                alt="" 
                className={styles.sortArrow} 
              />
            </div>
          </div>
          <div className={styles.viewControls}>
            <img 
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/822dc9b65f741a6656df95a9814638e5fc49e6cbe4dc7e0a8884539da8794ae1?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
              alt="Grid view" 
              className={styles.viewIcon} 
            />
            <img 
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/fe1858239a80f1f7abe717d1cf92397b00c93ec5523b01ede22f7b3b1e0e22e2?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
              alt="List view" 
              className={styles.viewIcon} 
            />
          </div>
        </div>
      </div>
      <ul className={styles.jobList}>
        {jobListings.map(job => (
          <JobListItem key={job.id} job={job} />
        ))}
      </ul>
    </section>
  );
}

function JobListItem({ job }) {
  const navigate = useNavigate();

  const handleApplyClick = () => {
    navigate('/jobdescription');
  };

  return (
    <li className={styles.jobItem}>
      <div className={styles.jobInfo}>
        <img src={job.logo} alt={`${job.company} logo`} className={styles.companyLogo} />
        <div>
          <h3 className={styles.jobTitle}>{job.title}</h3>
          <p className={styles.jobCompany}>{job.company}</p>
          <p className={styles.jobLocation}>{job.location}</p>
        </div>
      </div>
      <div className={styles.jobDetails}>
        <p className={styles.jobType}>{job.type}</p>
        <p className={styles.jobCategory}>{job.category}</p>
      </div>
      <button onClick={handleApplyClick} className={styles.applyButton}>
        Apply
      </button>
    </li>
  );
}
function Pagination() {
  return (
    <nav className={styles.pagination} aria-label="Job search results pages">
      <button className={styles.paginationButton} aria-label="Previous page">
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/7eb479b7448d2f9f329cadb166de67f8faa071b5b4d847b32b3fcac92f7a2899?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
          alt="" 
          className={styles.paginationArrow} 
        />
      </button>
      <ul className={styles.paginationList}>
        {[1, 2, 3, 4, 5, '...', 33].map((page, index) => (
          <li key={index}>
            <button 
              className={`${styles.paginationButton} ${page === 1 ? styles.active : ''}`}
              aria-current={page === 1 ? 'page' : undefined}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>
      <button className={styles.paginationButton} aria-label="Next page">
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/086e98d7777fa1afcb1cb506eacb417e9633360e5142dc9e63a63b443cf75ecb?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
          alt="" 
          className={styles.paginationArrow} 
        />
      </button>
    </nav>
  );
}

// Combined JobSearch Component


function HomeJobSeeker() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.mainContent}>
        <SearchForm />
        <div className={styles.contentWrapper}>
          <FilterSection />
          <JobList />
        </div>
        <Pagination />
      </main>
    </div>
  );
}

export default HomeJobSeeker;

import React from 'react';
import '../css/home_jobseeker.css'; // Assuming the CSS file is in the same directory
import { useNavigate } from 'react-router-dom';
// Combined Header Component
function Header() {
  return (
    <nav className="navbar">
      <div className="navbarContent">
        <div className="logo">
          <img 
            src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`} 
            alt="TrabahaDoor Logo" 
            className="logoImage" 
          />
          <span className="logoText">TrabahaDoor</span>
        </div>
        <ul className="navMenu">
          <li className="navItem">
            <a href="#" className="navLink">Find Jobs</a>
            <div className="activeIndicator" />
          </li>
          <li className="navItem">
            <a href="#" className="navLink">Browse Companies</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

function SearchForm() {
    return (
      <section className="searchForm">
        <form className="searchBar">


          <div className="s-inputContainer">
            <img 
              loading="lazy" 
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/e7f5ae91f74a0bbff814182823ec89164ff92f1d17811cfd85ad807eb891d404?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
              alt="" 
              className="s-inputImage" 
            />
            <div className="s-inputGroup">
              <label htmlFor="jobTitleInput" className="visually-hidden">Job title or keyword</label>
              <input
                type="text"
                id="jobTitleInput"
                placeholder="Job title or keyword"
                aria-label="Job title or keyword"
                className="s-inputGroup"
              />
              <div className="s-divider"></div>
            </div>
          </div>
          
          <div className="s-inputContainer">
            <div className="s-inputGroup">
                <label htmlFor="industrySelect" className="visually-hidden">Industry</label>
                <select
                id="industrySelect"
                aria-label="Industry"
                className="s-select"
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

  
          <button type="submit" className="searchButton">Search</button>
        </form>
        <p className="popularSearches">Popular: Teacher, Nurse, Carpenter, IT Support</p>
      </section>
    );
  }
// Combined FilterSection Component
function FilterSection() {
  const employmentTypes = ['Full-time', 'Part-Time', 'Remote', 'Internship', 'Contract'];
  const categories = ['Agriculture', 'Tourism', 'Marketing', 'Business', 'Human Resource', 'Healthcare', 'Engineering', 'Technology'];
  const salaryRanges = ['$700 - $1000', '$100 - $1500', '$1500 - $2000', '$3000 or above'];

  return (
    <div className="filterContainer">
      <FilterGroup title="Type of Employment" items={employmentTypes} />
      <FilterGroup title="Categories" items={categories} />
      <FilterGroup title="Salary Range" items={salaryRanges} />
    </div>
  );
}

function FilterGroup({ title, items }) {
  return (
    <div className="filterGroup">
      <h3 className="filterTitle">{title}</h3>
      <img 
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/0535a47d11c9869cd543561cec9c0500b285f25574c94bba865051e75300ca66?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
        alt="" 
        className="filterToggle" 
      />
      {items.map((item, index) => (
        <label key={index} className="filterOption">
          <input type="checkbox" className="filterCheckbox" />
          <span className="filterLabel">{item}</span>
        </label>
      ))}
    </div>
  );
}

// Combined JobList Component
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
    <section className="jobListContainer">
      <div className="jobListHeader">
        <div>
          <h2 className="jobListTitle">All Jobs</h2>
          <p className="jobListSubtitle">Showing 73 results</p>
        </div>
        <div className="jobListControls">
          <div className="sortControl">
            <span className="sortLabel">Sort by:</span>
            <div className="sortSelector">
              <span>Most relevant</span>
              <img 
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/0ecb1061ad2d3f67351803a0460e833050feee5cac983333e77bfe4ca63b6c8d?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
                alt="" 
                className="sortArrow" 
              />
            </div>
          </div>
          <div className="viewControls">
            <img 
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/822dc9b65f741a6656df95a9814638e5fc49e6cbe4dc7e0a8884539da8794ae1?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
              alt="Grid view" 
              className="viewIcon" 
            />
            <img 
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/fe1858239a80f1f7abe717d1cf92397b00c93ec5523b01ede22f7b3b1e0e22e2?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
              alt="List view" 
              className="viewIcon" 
            />
          </div>
        </div>
      </div>
      <ul className="jobList">
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
    <li className="jobItem">
      <div className="jobInfo">
        <img 
          src={job.logo} 
          alt={`${job.company} logo`} 
          className="companyLogo" 
        />
        <div className="jobDetails">
          <h3 className="jobTitle">{job.title}</h3>
          <p className="companyInfo">{job.company}</p>
          <p className="jobLocation">{job.location}</p>
          <div className="jobTags">
            <span className="jobType">{job.type}</span>
            {job.categories && job.categories.map((category, index) => (
              <span key={index} className="jobCategory">{category}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="jobActions">
      <button className="applyButton" onClick={handleApplyClick}>
        Apply
      </button>
        <div className="applicantInfo">
          <img 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/72e7343ed99c28ba12924f01c759d5bbc8e236f5cff0aa10de8e23c4dbc49799?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
            alt="" 
            className="applicantBar" 
          />
          <p className="applicantCount">
            <strong>{job.applicants} applied</strong> of {job.capacity} capacity
          </p>
        </div>
      </div>
    </li>
  );
}

// Combined Pagination Component
function Pagination() {
  return (
    <nav className="pagination" aria-label="Job search results pages">
      <button className="paginationButton" aria-label="Previous page">
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/7eb479b7448d2f9f329cadb166de67f8faa071b5b4d847b32b3fcac92f7a2899?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
          alt="" 
          className="paginationArrow" 
        />
      </button>
      <ul className="paginationList">
        {[1, 2, 3, 4, 5, '...', 33].map((page, index) => (
          <li key={index}>
            <button 
              className={`paginationButton ${page === 1 ? 'active' : ''}`}
              aria-current={page === 1 ? 'page' : undefined}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>
      <button className="paginationButton" aria-label="Next page">
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/086e98d7777fa1afcb1cb506eacb417e9633360e5142dc9e63a63b443cf75ecb?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
          alt="" 
          className="paginationArrow" 
        />
      </button>
    </nav>
  );
}

// Combined JobSearch Component
function JobSearch() {
  return (
    <div className="jobSearchContainer">
      <header className="headerBackground">
        <img  
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/96fc7570910ade49247aece2df9e06c01a34db5bd75a38c670596c57c995fb99?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
          alt="" 
          className="backgroundImage" 
        />
        <div className="headerContent">
          <Header />
          <main className="mainContent">
            <section className="heroSection">
              <h1 className="heroTitle">
                Discover your
                <span className="highlightText">
                  ideal career
                  <img 
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/0e4f503775d25096319c588932e0369ce3bf7bd731082cec1d1b58fb1f9bb7c9?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
                    alt="" 
                    className="underlineImage" 
                  />
                </span>
              </h1>
              <p className="heroSubtitle">Find your next possible workplace!</p>
            </section>
            <SearchForm />
          </main>
        </div>
      </header>
      <section className="jobListingSection">
        <aside className="filterSidebar">
          <FilterSection />
        </aside>
        <main className="jobListingMain">
          <JobList />
          <Pagination />
        </main>
      </section>
    </div>
  );
}

export default JobSearch;
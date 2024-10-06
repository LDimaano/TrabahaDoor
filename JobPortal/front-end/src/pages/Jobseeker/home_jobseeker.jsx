import React, { useState } from 'react';
import Header from '../../components/jsheader';
import SearchForm from '../../components/searchform';
import FilterSection from '../../components/filtersection';
import JobList from '../../components/joblist';

function HomeJobSeeker() {
  const [filters, setFilters] = useState({
    employmentTypes: [],
    salaryRanges: [],
    industry: '' // Add industry to the initial state
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [userSkills, setUserSkills] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // New state for active tab

  const handleFilterChange = (filterType, selectedItems) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: selectedItems
    }));
  };

  const handleSearchChange = (searchData) => {
    setSearchQuery(searchData.jobTitle);
    if (searchData.selectedIndustry) {
      setFilters((prevFilters) => ({ ...prevFilters, industry: searchData.selectedIndustry }));
    }
  };

  // Inline styles for the title
  const titleStyle = {
    fontSize: '2rem', // Font size
    fontWeight: '700', // Font weight
    color: '#333', // Darker text color
    textAlign: 'center', // Center the text
    margin: '2rem 0', // Margin above and below
    position: 'relative', // Position relative for pseudo-elements
  };

  const subtitleStyle = {
    fontSize: '1.2rem', // Smaller font size for the subtitle
    color: '#666', // Lighter text color
    textAlign: 'center', // Center the subtitle
    marginTop: '0.5rem', // Space above the subtitle
  };

  return (
    <div className="container">
      <Header />
      <main className="row mt-4">
        <div style={titleStyle}>
          <h1>Find Jobs</h1>
          <div style={subtitleStyle}>Discover opportunities that match your skills and interests</div>
        </div>
        <SearchForm onSearch={handleSearchChange} />
        <div className="row mt-3">
          {/* Filter Section (taking 3 columns) */}
          <div className="col-md-3">
            <FilterSection onFilterChange={handleFilterChange} />
          </div>
          {/* Job List (taking 9 columns, entire remaining width) */}
          <div className="col-md-9">
            {/* Tab Interface */}
            <div className="nav nav-tabs mb-3">
              <button 
                className={`nav-link ${activeTab === 'recommended' ? 'active' : ''}`} 
                onClick={() => setActiveTab('recommended')}
              >
                Recommended Jobs
              </button>
              <button 
                className={`nav-link ${activeTab === 'all' ? 'active' : ''}`} 
                onClick={() => setActiveTab('all')}
              >
                All Jobs
              </button>
            </div>

            {/* Conditional Rendering of Job Lists */}
            <JobList filters={filters} searchQuery={searchQuery} userSkills={userSkills} isRecommended={activeTab === 'recommended'} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomeJobSeeker;

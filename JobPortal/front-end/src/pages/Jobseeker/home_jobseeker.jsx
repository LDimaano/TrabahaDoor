import React, { useState } from 'react';
import Header from '../../components/jsheader';
import SearchForm from '../../components/searchform';
import FilterSection from '../../components/filtersection';
import JobList from '../../components/joblist';

function HomeJobSeeker() {
  const [filters, setFilters] = useState({
    employmentTypes: [],
    industry: '' 
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [userSkills, setUserSkills] = useState([]);
  const [activeTab, setActiveTab] = useState('recommended'); 

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

  const titleStyle = {
    fontSize: '2rem', 
    fontWeight: '700', 
    color: '#333', 
    textAlign: 'center', 
    margin: '2rem 0', 
    position: 'relative', 
  };

  const subtitleStyle = {
    fontSize: '1.2rem',
    color: '#666', 
    textAlign: 'center', 
    marginTop: '0.5rem', 
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
          <div className="col-md-3">
            <FilterSection onFilterChange={handleFilterChange} />
          </div>
          <div className="col-md-9">
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
            <JobList filters={filters} searchQuery={searchQuery} userSkills={userSkills} isRecommended={activeTab === 'recommended'} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomeJobSeeker;

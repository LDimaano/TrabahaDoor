import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSearch } from '@fortawesome/free-solid-svg-icons'; // Import the search icon
import Header from '../../components/jsheader';
import FilterSection from '../../components/filtersection';
import JobList from '../../components/joblist';
import { Range } from 'react-range';

function HomeJobSeeker() {
  const [filters, setFilters] = useState({
    employmentTypes: [],
    salaryRanges: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('jobTitle');
  const [salaryRange, setSalaryRange] = useState([5000, 100000]);
  const [userSkills, setUserSkills] = useState([]);
  const [activeTab, setActiveTab] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const handleSalaryRangeChange = (values) => {
    setSalaryRange(values);
  };

  const applySalaryFilter = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      salaryRanges: [`${salaryRange[0]}-${salaryRange[1]}`],
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="home-jobseeker">
      <Header />
      <div className="container mt-4" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="row">
          <div className="col-12 mb-4">
            <div className="d-flex align-items-center">
              {/* Search Input */}
              <div className="input-group me-3" style={{ flex: 1 }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Job title or Company Name"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
              </div>
              {/* Dropdown Filter Icon */}
              <button
                className="btn btn-secondary"
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <FontAwesomeIcon icon={faFilter} style={{ fontSize: '18px' }} />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="col-12 mb-4" style={{ textAlign: 'left' }}>
              <div className="filter-group">
                <FilterSection onFilterChange={handleFilterChange} />
              </div>
              <div className="filter-group mt-4">
                <h5>Salary Range</h5>
                <Range
                  step={1000}
                  min={5000}
                  max={100000}
                  values={salaryRange}
                  onChange={handleSalaryRangeChange}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: '6px',
                        width: '100%',
                        background: '#ccc',
                        marginBottom: '10px',
                      }}
                    >
                      {children}
                    </div>
                  )}
                  renderThumb={({ props }) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: '20px',
                        width: '20px',
                        background: '#007bff',
                        borderRadius: '50%',
                      }}
                    />
                  )}
                />
                <div
                  className="d-flex justify-content-between"
                  style={{ fontSize: '14px', marginBottom: '10px' }}
                >
                  <span>₱{salaryRange[0]}</span>
                  <span>₱{salaryRange[1]}</span>
                </div>
                <button className="btn btn-primary" onClick={applySalaryFilter}>
                  Apply
                </button>
              </div>
            </div>
          )}

          <div className="col-12">
            <div
              className="nav nav-tabs mb-3"
              style={{ justifyContent: 'flex-start', display: 'flex' }}
            >
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
            <div style={{ textAlign: 'left' }}>
              <JobList
                filters={filters}
                searchQuery={searchQuery}
                searchType={searchType}
                userSkills={userSkills}
                isRecommended={activeTab === 'recommended'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeJobSeeker;

import React, { useState } from 'react';
import Header from '../../components/jsheader';
import SearchForm from '../../components/searchform';
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

  return (
    <div className="home-jobseeker">
      {/* Header */}
      <Header />

      {/* Search Form */}
      <SearchForm
        searchQuery={searchQuery}
        searchType={searchType}
        onSearchChange={(query) => setSearchQuery(query)}
        onSearchTypeChange={(type) => setSearchType(type)}
      />

      <div className="container mt-4">
        <div className="row">
          {/* Filter Section */}
          <div className="col-md-4">
            <FilterSection onFilterChange={handleFilterChange} />

            {/* Salary Range Filter */}
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
              <div className="d-flex justify-content-between">
                <span>${salaryRange[0]}</span>
                <span>${salaryRange[1]}</span>
              </div>
              <button className="btn btn-primary mt-3" onClick={applySalaryFilter}>
                Apply
              </button>
            </div>
          </div>

          {/* Job List */}
          <div className="col-md-8">
            <JobList
              filters={filters}
              searchQuery={searchQuery}
              searchType={searchType}
              isRecommended={false} // Set to true if recommended jobs are required
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeJobSeeker;

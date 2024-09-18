import React, { useState } from 'react';
import Header from '../../components/jsheader';
import SearchForm from '../../components/searchform';
import FilterSection from '../../components/filtersection';
import JobList from '../../components/joblist';
import Pagination from '../../components/pagination';

function HomeJobSeeker() {
  const [filters, setFilters] = useState({
    employmentTypes: [],
    salaryRanges: []
  });
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = (filterType, selectedItems) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: selectedItems
    }));
  };

  const handleSearchChange = (searchData) => {
    setSearchQuery(searchData.jobTitle);
    // Optionally handle selectedIndustry if needed
    console.log(searchData.selectedIndustry);
  };

  return (
    <div className="container">
      <Header />
      <main className="row mt-4">
        <SearchForm onSearch={handleSearchChange} />
        <div className="row mt-3">
          {/* Filter Section (taking 3 columns) */}
          <div className="col-md-3">
            <FilterSection onFilterChange={handleFilterChange} />
          </div>
          {/* Job List (taking 9 columns, entire remaining width) */}
          <div className="col-md-9">
            <JobList filters={filters} searchQuery={searchQuery} />
          </div>
        </div>
        <Pagination />
      </main>
    </div>
  );
}

export default HomeJobSeeker;

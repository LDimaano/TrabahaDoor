import React, { useState } from 'react';
import Header from '../../components/empheader';
import SearchForm from '../../components/searchform';
import FilterSection from '../../components/filtersection';
import CandidateList from '../../components/candidatelist';
import Pagination from '../../components/pagination';


function HomeEmployer() {
  const [searchParams, setSearchParams] = useState({}); // State to store search criteria


  // Handle search and update state
  const handleSearch = (params) => {
    setSearchParams(params); // Update search params (job title and industry)
  };


  return (
    <div className="container">
      <Header />
      <main className="row mt-4">
        <SearchForm onSearch={handleSearch} /> {/* Pass handleSearch to SearchForm */}
        <div className="row mt-3">
          <div className="col-md-3">
            <FilterSection />
          </div>
          <div className="col-md-9">
            <CandidateList searchParams={searchParams} /> {/* Pass search params to CandidateList */}
          </div>
        </div>
        <Pagination />
      </main>
    </div>
  );
}


export default HomeEmployer;



import React from 'react';
import Header from '../../components/empheader';
import SearchForm from '../../components/searchform';
import FilterSection from '../../components/filtersection';
import CandidateList from '../../components/candidatelist';
import Pagination from '../../components/pagination';

function HomeEmployer() {
  return (
    <div className="container">
      <Header />
      <main className="row mt-4">
        <SearchForm />
        <div className="row mt-3">
          {/* Filter Section (taking 3 columns) */}
          <div className="col-md-3">
            <FilterSection />
          </div>
          {/* Job List (taking 9 columns, entire remaining width) */}
          <div className="col-md-9">
            <CandidateList />
          </div>
        </div>
        <Pagination />
      </main>
    </div>
  );
}

export default HomeEmployer;

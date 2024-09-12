import React from 'react';
import Header from '../components/jsheader';
import SearchForm from '../components/searchform';
import FilterSection from '../components/filtersection';
import CandidateList from '../components/candidatelist';
import Pagination from '../components/pagination';

function HomeEmployer() {
  return (
    <div className="container">
      <Header />
      <main className="row mt-4">
        <SearchForm />
        <div className="d-flex">
          <FilterSection />
          <CandidateList />
        </div>
        <Pagination />
      </main>
    </div>
  );
}

export default HomeEmployer;

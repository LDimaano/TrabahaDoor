import React from 'react';
import Header from '../components/jsheader';
import SearchForm from '../components/searchform';
import FilterSection from '../components/filtersection';
import JobList from '../components/joblist';
import Pagination from '../components/pagination';

function HomeJobSeeker() {
  return (
    <div className="container">
      <Header />
      <main className="row mt-4">
        <SearchForm />
        <div className="d-flex">
          <FilterSection />
          <JobList />
        </div>
        <Pagination />
      </main>
    </div>
  );
}

export default HomeJobSeeker;

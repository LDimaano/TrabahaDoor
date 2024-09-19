import React, { useState } from 'react';
import Header from '../../components/empheader';
import SearchForm from '../../components/searchform';
import CandidateList from '../../components/candidatelist';
import Pagination from '../../components/pagination';

function HomeEmployer() {
  const [searchParams, setSearchParams] = useState({}); // State to store search criteria

  // Handle search and update state
  const handleSearch = (params) => {
    setSearchParams(params); // Update search params (job title and industry)
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
          <h1>Explore Job Seekers</h1>
          <div style={subtitleStyle}>Find the best candidates for your roles</div>
        </div>
        <SearchForm onSearch={handleSearch} /> {/* Pass handleSearch to SearchForm */}
        <div className="row mt-3">
          <div className="col-md-12">
            <CandidateList searchParams={searchParams} /> {/* Pass search params to CandidateList */}
          </div>
        </div>
        <Pagination />
      </main>
    </div>
  );
}

export default HomeEmployer;

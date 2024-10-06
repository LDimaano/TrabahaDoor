import React, { useState } from 'react';
import Header from '../../components/empheader';
import SearchForm from '../../components/searchform_emp';
import CandidateList from '../../components/candidatelist';

function HomeEmployer() {
  const [searchParams, setSearchParams] = useState({});
  const [activeTab, setActiveTab] = useState('all'); // State to manage the active tab

  // Handle search and update state with search parameters from SearchForm
  const handleSearch = (params) => {
    setSearchParams(params);
  };

  // Inline styles for the title
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
          <h1>Explore Job Seekers</h1>
          <div style={subtitleStyle}>Find the best candidates for your roles</div>
        </div>
        {/* Pass the handleSearch function to SearchForm */}
        <SearchForm onSearch={handleSearch} />
        <div className="row mt-3">
          <div className="col-md-12">
            {/* Tab Interface */}
            <div className="nav nav-tabs mb-3">
              <button
                className={`nav-link ${activeTab === 'recommended' ? 'active' : ''}`}
                onClick={() => setActiveTab('recommended')}
              >
                Recommended Candidates
              </button>
              <button
                className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Candidates
              </button>
            </div>

            {/* Conditional Rendering of Candidate Lists */}
            <CandidateList searchParams={searchParams} isRecommended={activeTab === 'recommended'} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomeEmployer;

import React, { useState } from 'react';
import Header from '../../components/empheader';
import SearchForm from '../../components/searchform_emp';
import CandidateList from '../../components/candidatelist';
import { Helmet } from 'react-helmet';
import Footer from '../../components/footer2';

function HomeEmployer() {
  const [allCandidates, setAllCandidates] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [activeTab, setActiveTab] = useState('recommended');

  const handleSearch = (params) => {
    setSearchParams(params);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Helmet>
        <title>TrabahaDoor - Employer</title>
      </Helmet>
      <Header />
      <main className="container" style={{ flex: 1 }}>
        <div className="row mt-4">
          <div className="col-md-12 text-center">
            <h1>Explore Job Seekers</h1>
            <p>Find the best candidates for your roles</p>
          </div>
          <SearchForm onSearch={handleSearch} />
          <div className="row mt-3">
            <div className="col-md-12">
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

              <CandidateList
                searchParams={searchParams}
                isRecommended={activeTab === 'recommended'}
                allCandidates={allCandidates}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer style={{ marginTop: 'auto', width: '100%' }} />
    </div>
  );
}

export default HomeEmployer;

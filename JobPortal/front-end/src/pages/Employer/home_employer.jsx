import React, { useState, useEffect } from 'react';
import Header from '../../components/empheader';
import SearchForm from '../../components/searchform_emp';
import CandidateList from '../../components/candidatelist';
import { Helmet } from 'react-helmet';

function HomeEmployer() {
  const [allCandidates, setAllCandidates] = useState([]); // Store all fetched candidates
  const [searchParams, setSearchParams] = useState({});
  const [activeTab, setActiveTab] = useState('all'); // State to manage the active tab

  // Fetch candidates once when the component mounts
  // useEffect(() => {
  //   const fetchAllCandidates = async () => {
  //     try {
  //       const response = await fetch(`${process.env.REACT_APP_API_URL}/api/candidates`);
  //       if (!response.ok) throw new Error('Failed to fetch candidates');
  //       const data = await response.json();
  //       setAllCandidates(data);
  //     } catch (error) {
  //       console.error('Error fetching candidates:', error);
  //     }
  //   };

  //   fetchAllCandidates();
  // }, []);

  // Handle search and update state with search parameters from SearchForm
  const handleSearch = (params) => {
    setSearchParams(params);
  };

  return (
    <div className="container">
      <Helmet>
        <title>TrabahaDoor - Employer</title> {/* Set the page title */}
      </Helmet>
      <Header />
      <main className="row mt-4">
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

            {/* Pass allCandidates, searchParams, and the value of isRecommended based on activeTab */}
            <CandidateList
              searchParams={searchParams}
              isRecommended={activeTab === 'recommended'}  // Set isRecommended based on activeTab
              allCandidates={allCandidates}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomeEmployer;

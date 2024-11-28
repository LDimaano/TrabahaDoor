import React, { useState, useEffect } from 'react';

function SearchForm({ onSearch }) {
  const [industryOptions, setIndustryOptions] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');

  const fetchIndustries = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/industries`);
      if (!response.ok) throw new Error('Failed to fetch industries');
      const data = await response.json();
      setIndustryOptions(data);
    } catch (error) {
      console.error('Error fetching industries:', error);
      setError('Failed to load industries.');
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  useEffect(() => {
    onSearch({ searchQuery, selectedIndustry }); // Real-time search updates
  }, [searchQuery, selectedIndustry, onSearch]);

  const handleClearSearchQuery = () => setSearchQuery('');
  const handleClearIndustry = () => setSelectedIndustry('');

  const isSearchQueryActive = searchQuery !== '';
  const isIndustryActive = selectedIndustry !== '';

  return (
    <section className="container my-4">
      <form className="row g-3">
        <div className="col-md-6 position-relative">
          {isSearchQueryActive && (
            <button
              type="button"
              className="btn position-absolute"
              onClick={handleClearSearchQuery}
              aria-label="Clear Search Query Filter"
              style={{
                width: '30px',
                height: '30px',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '0',
                backgroundColor: 'transparent',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'gray',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
          <input
            type="text"
            className="form-control"
            placeholder="Job title or Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Job title or keyword"
            style={{
              paddingLeft: isSearchQueryActive ? '40px' : '10px',
            }}
          />
        </div>
        <div className="col-md-4 position-relative">
          {isIndustryActive && (
            <button
              type="button"
              className="btn position-absolute"
              onClick={handleClearIndustry}
              aria-label="Clear Industry Filter"
              style={{
                width: '30px',
                height: '30px',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '0',
                backgroundColor: 'transparent',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'gray',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
          <select
            className="form-select"
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            aria-label="Select Industry"
            style={{
              paddingLeft: isIndustryActive ? '40px' : '10px',
            }}
          >
            <option value="">Select Industry</option>
            {industryOptions.length > 0 ? (
              industryOptions.map((industry) => (
                <option key={industry.industry_id} value={industry.industry_id}>
                  {industry.industry_name}
                </option>
              ))
            ) : (
              <option disabled>{error || 'Loading industries...'}</option>
            )}
          </select>
        </div>
        <div className="col-md-2">
          <button type="button" className="btn btn-primary w-100">
            Search
          </button>
        </div>
      </form>
    </section>
  );
}

export default SearchForm;

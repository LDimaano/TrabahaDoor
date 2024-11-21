import React, { useState, useEffect } from 'react';

function SearchForm({ onSearch }) {
  const [industryOptions, setIndustryOptions] = useState([]);
  const [error, setError] = useState(null);
  const [jobTitle, setJobTitle] = useState(''); 
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchType = jobTitle ? "jobTitle" : "companyName"; 
    onSearch({ jobTitle, selectedIndustry, searchType }); 
  };

  // Handle clearing filters for job title
  const handleClearJobTitle = () => {
    setJobTitle(''); 
    onSearch({ jobTitle: '', selectedIndustry }); 
  };

  // Handle clearing filters for selected industry
  const handleClearIndustry = () => {
    setSelectedIndustry(''); 
    onSearch({ jobTitle, selectedIndustry: '' }); 
  };

  const isJobTitleActive = jobTitle !== '';
  const isIndustryActive = selectedIndustry !== '';

  return (
    <section className="container my-4">
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-6 position-relative">
          {isJobTitleActive && (
            <button
              type="button"
              className="btn position-absolute"
              onClick={handleClearJobTitle}
              aria-label="Clear Job Title Filter"
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
            placeholder="Job title or Company name"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)} 
            aria-label="Job title or keyword"
            style={{
              paddingLeft: isJobTitleActive ? '40px' : '10px', 
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
          <button type="submit" className="btn btn-primary w-100">Search</button>
        </div>
      </form>
    </section>
  );
}

export default SearchForm;
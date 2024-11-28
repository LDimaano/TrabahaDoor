import React, { useState, useEffect } from 'react';

function SearchForm({ onSearch }) {
  const [industryOptions, setIndustryOptions] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // Unified state for both job title/keyword and full name
  const [selectedIndustry, setSelectedIndustry] = useState(''); // State for selected industry

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

  // Update search params as user types or selects an industry
  useEffect(() => {
    // Dynamically call onSearch whenever searchQuery or selectedIndustry changes
    onSearch({ searchQuery, selectedIndustry });
  }, [searchQuery, selectedIndustry, onSearch]); // Trigger onSearch when any of these change

  // Handle clearing filters for search query
  const handleClearSearchQuery = () => {
    setSearchQuery(''); // Reset search query
  };

  // Handle clearing filters for selected industry
  const handleClearIndustry = () => {
    setSelectedIndustry(''); // Reset selected industry
  };

  // Determine if the search query field has a value
  const isSearchQueryActive = searchQuery !== '';
  // Determine if the industry dropdown has a value
  const isIndustryActive = selectedIndustry !== '';

  return (
    <section className="container my-4">
      <form className="row g-3">
        <div className="col-md-6 position-relative">
          {/* Clear Filters button shown if search query field is active */}
          {isSearchQueryActive && (
            <button
              type="button"
              className="btn position-absolute"
              onClick={handleClearSearchQuery}
              aria-label="Clear Search Query Filter"
              style={{
                width: '30px',
                height: '30px',
                left: '10px', // Position it to the left of the input
                top: '50%', // Center vertically
                transform: 'translateY(-50%)', // Adjust for proper vertical centering
                padding: '0', // No padding
                backgroundColor: 'transparent', // Transparent background
                border: 'none', // No border
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'gray', // Gray color for the icon
                fontSize: '14px',
                cursor: 'pointer', // Cursor pointer on hover
              }}
            >
              <i className="fas fa-times"></i> {/* X icon */}
            </button>
          )}
          <input
            type="text"
            className="form-control"
            placeholder="Job title or Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
            aria-label="Job title or keyword"
            style={{
              paddingLeft: isSearchQueryActive ? '40px' : '10px', // Add padding to avoid overlap with the X icon
            }}
          />
        </div>
        <div className="col-md-4 position-relative">
          {/* Clear Filters button shown if industry dropdown is active */}
          {isIndustryActive && (
            <button
              type="button"
              className="btn position-absolute"
              onClick={handleClearIndustry}
              aria-label="Clear Industry Filter"
              style={{
                width: '30px',
                height: '30px',
                left: '10px', // Position it to the left of the dropdown
                top: '50%', // Center vertically
                transform: 'translateY(-50%)', // Adjust for proper vertical centering
                padding: '0', // No padding
                backgroundColor: 'transparent', // Transparent background
                border: 'none', // No border
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'gray', // Gray color for the icon
                fontSize: '14px',
                cursor: 'pointer', // Cursor pointer on hover
              }}
            >
              <i className="fas fa-times"></i> {/* X icon */}
            </button>
          )}
          <select
            className="form-select"
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)} // Update selected industry state
            aria-label="Select Industry"
            style={{
              paddingLeft: isIndustryActive ? '40px' : '10px', // Add padding to avoid overlap with the X icon
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
      </form>
    </section>
  );
}

export default SearchForm;

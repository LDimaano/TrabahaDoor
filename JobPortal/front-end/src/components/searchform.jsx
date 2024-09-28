import React, { useState, useEffect } from 'react';

function SearchForm({ onSearch }) {
  const [industryOptions, setIndustryOptions] = useState([]);
  const [error, setError] = useState(null);
  const [jobTitle, setJobTitle] = useState(''); // State for job title/keyword
  const [selectedIndustry, setSelectedIndustry] = useState(''); // State for selected industry

  const fetchIndustries = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/industries');
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
  onSearch({ jobTitle, selectedIndustry }); // Pass the job title and selected industry to the parent
};

  // Handle clearing filters for job title
  const handleClearJobTitle = () => {
    setJobTitle(''); // Reset job title
    onSearch({ jobTitle: '', selectedIndustry }); // Pass empty parameters to reset search
  };

  // Handle clearing filters for selected industry
  // Handle clearing filters for selected industry
const handleClearIndustry = () => {
  setSelectedIndustry(''); // Reset selected industry
  onSearch({ jobTitle, selectedIndustry: '' }); // Pass empty industry to parent
};


  // Determine if the job title field has a value
  const isJobTitleActive = jobTitle !== '';
  // Determine if the industry dropdown has a value
  const isIndustryActive = selectedIndustry !== '';

  return (
    <section className="container my-4">
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-6 position-relative">
          {/* Clear Filters button shown if job title field is active */}
          {isJobTitleActive && (
            <button
              type="button"
              className="btn position-absolute"
              onClick={handleClearJobTitle}
              aria-label="Clear Job Title Filter"
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
            placeholder="Job title or keyword"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)} // Update job title state
            aria-label="Job title or keyword"
            style={{
              paddingLeft: isJobTitleActive ? '40px' : '10px', // Add padding to avoid overlap with the X icon
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
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary w-100">Search</button>
        </div>
      </form>
    </section>
  );
}

export default SearchForm;

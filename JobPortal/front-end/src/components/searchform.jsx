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


  // Handle form submission and pass search data to parent
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ jobTitle, selectedIndustry });
  };


  return (
    <section className="container my-4">
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Job title or keyword"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)} // Update job title state
            aria-label="Job title or keyword"
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)} // Update selected industry state
            aria-label="Select Industry"
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

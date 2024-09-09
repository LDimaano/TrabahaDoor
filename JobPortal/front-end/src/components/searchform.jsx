import React from 'react';

function SearchForm() {
  return (
    <section className="container my-4">
      <form className="row g-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Job title or keyword"
            aria-label="Job title or keyword"
          />
        </div>
        <div className="col-md-4">
          <select className="form-select" aria-label="Select Industry">
            <option value="">Select Industry</option>
            <option value="agriculture">Agriculture</option>
            <option value="tourism">Tourism</option>
            <option value="marketing">Marketing</option>
            <option value="business">Business</option>
            <option value="hr">Human Resource</option>
            <option value="healthcare">Healthcare</option>
            <option value="engineering">Engineering</option>
            <option value="technology">Technology</option>
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

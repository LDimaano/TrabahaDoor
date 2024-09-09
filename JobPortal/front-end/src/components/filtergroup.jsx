import React from 'react';

function FilterGroup({ title, items }) {
  return (
    <div className="mb-4">
      <h5>{title}</h5>
      {items.map((item, index) => (
        <div key={index} className="form-check">
          <input className="form-check-input" type="checkbox" id={`filter-${index}`} />
          <label className="form-check-label" htmlFor={`filter-${index}`}>
            {item}
          </label>
        </div>
      ))}
    </div>
  );
}

export default FilterGroup;
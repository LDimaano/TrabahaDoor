import React from 'react';

const FilterGroup = ({ title, items }) => {
  return (
    <div className="mb-3">
      <h5>{title}</h5>
      {items.map((item, index) => (
        <div key={index} className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id={`filter-${title}-${index}`}
            value={item}
          />
          <label className="form-check-label" htmlFor={`filter-${title}-${index}`}>
            {item}
          </label>
        </div>
      ))}
    </div>
  );
};

export default FilterGroup;

import React from 'react';

const FilterGroup = ({ title, items, selectedItems, onChange }) => {
  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    const updatedSelectedItems = isChecked
      ? [...selectedItems, value]
      : selectedItems.filter(item => item !== value);

    onChange(updatedSelectedItems);
  };

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
            checked={selectedItems.includes(item)}
            onChange={handleCheckboxChange}
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

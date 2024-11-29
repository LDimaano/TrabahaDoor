import React, { useState } from 'react';
import { Range } from 'react-range';
import FilterGroup from './filtergroup';

function FilterSection({ onFilterChange }) {
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState([]);
  const [selectedSalaryRange, setSelectedSalaryRange] = useState([5000, 100000]);

  const employmentTypes = ['Full-time', 'Part-Time', 'Work from Home'];

  const handleEmploymentTypeChange = (selectedItems) => {
    setSelectedEmploymentTypes(selectedItems);
    onFilterChange('employmentTypes', selectedItems);
  };

  const handleSalaryRangeChange = (values) => {
    setSelectedSalaryRange(values);
    onFilterChange('salaryRange', values);
  };

  return (
    <div className="col-md-6">
      <FilterGroup
        title="Employment Type"
        items={employmentTypes}
        selectedItems={selectedEmploymentTypes}
        onChange={handleEmploymentTypeChange}
      />
      <div className="filter-group">
        <label htmlFor="salaryRange" className="form-label fw-bold d-block mb-2">
          Salary Range (in ₱)
        </label>
        <div
          className="slider-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <small
            style={{
              fontSize: '0.9rem',
              color: '#6c757d',
              marginRight: '8px',
            }}
          >
            ₱5,000
          </small>
          <Range
            step={1000}
            min={5000}
            max={100000}
            values={selectedSalaryRange}
            onChange={handleSalaryRangeChange}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: '6px',
                  width: '100%',
                  backgroundColor: '#ddd',
                }}
              >
                {children}
              </div>
            )}
            renderThumb={({ props }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: '16px',
                  width: '16px',
                  backgroundColor: '#007bff',
                  borderRadius: '50%',
                }}
              />
            )}
          />
          <small
            style={{
              fontSize: '0.9rem',
              color: '#6c757d',
              margin: '0 8px',
            }}
          >
            {`₱${selectedSalaryRange[0]} to ₱${selectedSalaryRange[1]}`}
          </small>
          <small
            style={{
              fontSize: '0.9rem',
              color: '#6c757d',
              marginLeft: '8px',
            }}
          >
            ₱100,000
          </small>
        </div>
      </div>
    </div>
  );
}

export default FilterSection;

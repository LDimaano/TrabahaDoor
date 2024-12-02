import React, { useState } from 'react';
import FilterGroup from './filtergroup';
import { Range } from 'react-range';

const STEP = 1000;
const MIN = 5000;
const MAX = 100000;

function FilterSection({ onFilterChange }) {
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState([]);
  const [salaryRange, setSalaryRange] = useState([MIN, MAX]);

  const employmentTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Temporary',
    'Internship',
    'Volunteer',
    'Freelance'
  ];

  const handleEmploymentTypeChange = (selectedItems) => {
    setSelectedEmploymentTypes(selectedItems);
    onFilterChange('employmentTypes', selectedItems);
  };

  const handleSalaryRangeChange = (values) => {
    setSalaryRange(values);
    onFilterChange('salaryRange', `${values[0]}-${values[1]}`);
  };

  return (
    <div className="col-md-6">
      <FilterGroup
        title="Employment Type"
        items={employmentTypes}
        selectedItems={selectedEmploymentTypes}
        onChange={handleEmploymentTypeChange}
      />
      <div className="mt-4">
        <h5>Salary Range</h5>
        <Range
          values={salaryRange}
          step={STEP}
          min={MIN}
          max={MAX}
          onChange={handleSalaryRangeChange}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '6px',
                width: '100%',
                backgroundColor: '#ccc'
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
                backgroundColor: '#999'
              }}
            />
          )}
        />
        <div>
          <span>{`$${salaryRange[0]}`}</span> - <span>{`$${salaryRange[1]}`}</span>
        </div>
      </div>
    </div>
  );
}

export default FilterSection;

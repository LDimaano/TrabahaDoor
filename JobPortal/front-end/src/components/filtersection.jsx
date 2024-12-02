import React, { useState } from 'react';
import FilterGroup from './filtergroup';

function FilterSection({ onFilterChange }) {
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState([]);

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

  return (
    <div className="col-md-6">
      <FilterGroup
        title="Employment Type"
        items={employmentTypes}
        selectedItems={selectedEmploymentTypes}
        onChange={handleEmploymentTypeChange}
      />
    </div>
  );
}

export default FilterSection;

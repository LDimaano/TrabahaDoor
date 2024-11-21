import React, { useState } from 'react';
import FilterGroup from './filtergroup';

function FilterSection({ onFilterChange }) {
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState([]);
  const [selectedSalaryRanges, setSelectedSalaryRanges] = useState([]);

  const employmentTypes = ['Full-time', 'Part-Time', 'Work from Home'];
  const salaryRanges = [
    'Below 15000',
    '15001-25000',
    '25001-35000',
    '35001-50000',
    '50001-75000',
    '75001-100000',
    'Above 100000'
  ];

  const handleEmploymentTypeChange = (selectedItems) => {
    setSelectedEmploymentTypes(selectedItems);
    onFilterChange('employmentTypes', selectedItems);
  };

  const handleSalaryRangeChange = (selectedItems) => {
    setSelectedSalaryRanges(selectedItems);
    onFilterChange('salaryRanges', selectedItems);
  };

  return (
    <div className="col-md-6">
      <FilterGroup
        title="Employment Type"
        items={employmentTypes}
        selectedItems={selectedEmploymentTypes}
        onChange={handleEmploymentTypeChange}
      />
      <FilterGroup
        title="Salary Range"
        items={salaryRanges}
        selectedItems={selectedSalaryRanges}
        onChange={handleSalaryRangeChange}
      />
    </div>
  );
}

export default FilterSection;

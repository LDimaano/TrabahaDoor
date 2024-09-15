import React from 'react';
import FilterGroup from './filtergroup';

function FilterSection() {
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

  return (
    <div className="col-md-6"> {/* Adjusted to col-md-6 for more space */}
      <FilterGroup title="Employment Type" items={employmentTypes} />
      <FilterGroup title="Salary Range" items={salaryRanges} />
    </div>
  );
}

export default FilterSection;

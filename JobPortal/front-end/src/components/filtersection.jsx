import React from 'react';
import FilterGroup from './filtergroup';

function FilterSection() {
  const employmentTypes = ['Full-time', 'Part-Time', 'Remote', 'Internship', 'Contract'];
  const categories = ['Agriculture', 'Tourism', 'Marketing', 'Business', 'Human Resource', 'Healthcare', 'Engineering', 'Technology'];
  const salaryRanges = ['$700 - $1000', '$1000 - $1500', '$1500 - $2000', '$3000 or above'];

  return (
    <div className="col-md-3">
      <FilterGroup title="Type of Employment" items={employmentTypes} />
      <FilterGroup title="Categories" items={categories} />
      <FilterGroup title="Salary Range" items={salaryRanges} />
    </div>
  );
}

export default FilterSection;

import React from 'react';
import FormSection from './formsection';
import InputField from './inputfield';
import CheckboxGroup from './checkboxgroup';
import SalaryRange from './salaryrange';
import Dropdown from './dropdown';
import SkillTags from './skilltag';
import 'bootstrap/dist/css/bootstrap.min.css';

const JobInformationForm = () => (
  <form>
    <FormSection
      title="Basic Information"
      description="Tell us about the role and requirements"
    >
      <InputField label="Job Title" placeholder="e.g. Senior Software Engineer" />
      <Dropdown label="Experience Level" options={[
        { value: 'internship', label: 'Internship' },
        { value: 'entry', label: 'Entry Level' },
        { value: 'mid', label: 'Mid Level' },
        { value: 'senior', label: 'Senior Level' },
      ]} />
      <CheckboxGroup options={['Remote', 'Part-time']} />
    </FormSection>
    <FormSection
      title="Salary Range"
      description="Provide the expected salary range"
    >
      <SalaryRange />
    </FormSection>
    <FormSection
      title="Required Skills"
      description="List the skills required for this role"
    >
      <SkillTags tags={['JavaScript', 'React', 'Node.js']} />
    </FormSection>
  </form>
);

export default JobInformationForm;

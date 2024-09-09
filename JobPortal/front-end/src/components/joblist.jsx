import React from 'react';
import JobListItem from './joblistitem';

const jobListings = [
  {
    id: 1,
    title: 'Accounting Staff',
    company: 'ACE Hardware Phils., INC.',
    location: 'Abra, San Jose',
    type: 'Full-Time',
    category: 'Business',
    logo: 'https://cdn.builder.io/api/v1/image/assets/TEMP/9425037a463a3276bdd0dbe0bb7a97e94562d9cb4cf54c89ff3e657f8ba47003?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975',
    applicants: 5,
    capacity: 10
  },
  {
    id: 2,
    title: 'Customer Associate',
    company: 'LBC Express INC.',
    location: 'San Jose Batangas',
    type: 'Full-Time',
    categories: ['Marketing', 'Design'],
    logo: 'https://cdn.builder.io/api/v1/image/assets/TEMP/7e9a9c379bf2a5338cc9fde75045b1de52a97535c4bf64bfa94b37a227b37a57?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975',
    applicants: 4,
    capacity: 5
  },
];

function JobList() {
  return (
    <div className="col-md-9">
      <h2>All Jobs</h2>
      <ul className="list-group">
        {jobListings.map(job => (
          <JobListItem key={job.id} job={job} />
        ))}
      </ul>
    </div>
  );
}

export default JobList;

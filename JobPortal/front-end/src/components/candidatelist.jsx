import React from 'react';
import ApplicantListItem from './candidatelistitem'; // Make sure the path is correct

const applicants = [
  {
    id: 1,
    name: 'John Doe',
    jobTitle: 'Accounting Staff',
    company: 'ACE Hardware Phils., INC.',
    location: 'Abra, San Jose',
    profilePicture: 'https://cdn.builder.io/api/v1/image/assets/TEMP/9425037a463a3276bdd0dbe0bb7a97e94562d9cb4cf54c89ff3e657f8ba47003?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975',
  },
  {
    id: 2,
    name: 'Jane Smith',
    jobTitle: 'Customer Associate',
    company: 'LBC Express INC.',
    location: 'San Jose Batangas',
    profilePicture: 'https://cdn.builder.io/api/v1/image/assets/TEMP/9425037a463a3276bdd0dbe0bb7a97e94562d9cb4cf54c89ff3e657f8ba47003?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975',
  },
];

function ApplicantList() {
  return (
    <div className="col-md-9">
      <h2>All Applicants</h2>
      <ul className="list-group">
        {applicants.map(applicant => (
          <ApplicantListItem key={applicant.id} applicant={applicant} />
        ))}
      </ul>
    </div>
  );
}

export default ApplicantList;

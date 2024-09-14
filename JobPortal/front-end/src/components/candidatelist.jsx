import React, { useState, useEffect } from 'react';
import ApplicantListItem from './candidatelistitem'; // Make sure the path is correct

function ApplicantList() {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/applicants/applicantlist') // Make sure this matches your backend route
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setApplicants(data);
      })
      .catch((error) => console.error('Error fetching job listings:', error));
  }, []);
  

  return (
    <ul className="list-group">
      {applicants.map((applicant) => (
        <ApplicantListItem key={applicants.jsid} applicant={applicant} />
      ))}
    </ul>
  );
}

export default ApplicantList;

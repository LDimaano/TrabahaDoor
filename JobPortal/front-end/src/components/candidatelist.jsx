import React, { useState, useEffect } from 'react';
import ApplicantListItem from './candidatelistitem';


function CandidateList({ searchParams }) {
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const query = new URLSearchParams(searchParams).toString(); // Convert search params to query string
        const response = await fetch(`http://localhost:5000/api/applicants/applicantlist?${query}`);
        if (!response.ok) throw new Error('Failed to fetch applicants');
        const data = await response.json();
        setApplicants(data);
      } catch (error) {
        console.error('Error fetching applicants:', error);
        setError('Failed to load applicants.');
      }
    };


    fetchApplicants();
  }, [searchParams]); // Re-fetch applicants whenever searchParams changes


  return (
    <ul className="list-group">
      {error ? (
        <li className="list-group-item text-danger">{error}</li>
      ) : applicants.length > 0 ? (
        applicants.map((applicant) => (
          <ApplicantListItem key={applicant.jsid} applicant={applicant} />
        ))
      ) : (
        <li className="list-group-item">No applicants found</li>
      )}
    </ul>
  );
}


export default CandidateList;



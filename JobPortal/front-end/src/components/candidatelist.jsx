import React, { useState, useEffect } from 'react';
import ApplicantListItem from './candidatelistitem';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/pagination.css'; // Ensure you import the custom CSS

function CandidateList({ searchParams = {}, isRecommended }) {
  const [applicants, setApplicants] = useState([]);
  const [recommendedApplicants, setRecommendedApplicants] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [applicantsPerPage] = useState(5); // Set the number of applicants per page

  useEffect(() => {
    const fetchApplicants = async () => {
      let url = `http://localhost:5000/api/applicants/applicantlist`;
      const query = new URLSearchParams(searchParams).toString();
      if (query) {
        url += `?${query}`;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch applicants: ${response.status}`);
        }
        const data = await response.json();
        setApplicants(data);
      } catch (error) {
        console.error('Error fetching applicants:', error);
        setError('Failed to load applicants.');
      }
    };

    if (!isRecommended) {
      fetchApplicants();
      setRecommendedApplicants([]);
    }
  }, [searchParams, isRecommended]);

  useEffect(() => {
    const fetchRecommendedCandidates = async () => {
      const userId = sessionStorage.getItem('user_id'); // Get user ID from session storage
      console.log('User ID for recommendations:', userId); // Log the user ID
  
      try {
        // Fetch recommended candidates
        const response = await fetch('http://localhost:5000/api/recommend-candidates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }), // Include jobPostings in the request body
        });
  
        if (!response.ok) {
          throw new Error(`Failed to fetch recommended candidates: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('Recommended candidates data:', data); // Log the recommended candidates data
  
        if (data.recommendations) {
          setRecommendedApplicants(data.recommendations);
        } else {
          console.log('No recommendations found.');
        }
      } catch (error) {
        console.error('Error fetching recommended candidates:', error);
        setError('Failed to load recommended candidates.');
      }
    };
  
    if (isRecommended) {
      fetchRecommendedCandidates();
      setApplicants([]);
    }
  }, [isRecommended]);

  const indexOfLastApplicant = currentPage * applicantsPerPage;
  const indexOfFirstApplicant = indexOfLastApplicant - applicantsPerPage;
  const currentApplicants = isRecommended 
    ? recommendedApplicants.slice(indexOfFirstApplicant, indexOfLastApplicant)
    : applicants.slice(indexOfFirstApplicant, indexOfLastApplicant);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalApplicants = isRecommended ? recommendedApplicants.length : applicants.length;

  return (
    <div>
      {isRecommended ? (
        <>
          <h3>Recommended Candidates</h3>
          {error ? (
            <p className="text-danger">{error}</p>
          ) : currentApplicants.length > 0 ? (
            <>
              <ul className="list-group">
                {currentApplicants.map((applicant) => (
                  <ApplicantListItem key={applicant.user_id} applicant={applicant} />
                ))}
              </ul>
              <Pagination 
                applicantsPerPage={applicantsPerPage} 
                totalApplicants={totalApplicants} 
                paginate={paginate} 
                currentPage={currentPage}
              />
            </>
          ) : (
            <p>No recommended candidates available</p>
          )}
        </>
      ) : (
        <>
          <h3>All Candidates</h3>
          {error ? (
            <p className="text-danger">{error}</p>
          ) : currentApplicants.length > 0 ? (
            <>
              <ul className="list-group">
                {currentApplicants.map((applicant) => (
                  <ApplicantListItem key={applicant.user_id} applicant={applicant} />
                ))}
              </ul>
              <Pagination 
                applicantsPerPage={applicantsPerPage} 
                totalApplicants={totalApplicants} 
                paginate={paginate} 
                currentPage={currentPage}
              />
            </>
          ) : (
            <p>No applicants available</p>
          )}
        </>
      )}
    </div>
  );
}

const Pagination = ({ applicantsPerPage, totalApplicants, paginate, currentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalApplicants / applicantsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination justify-content-center">
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <a onClick={() => paginate(number)} href="#!" className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CandidateList;

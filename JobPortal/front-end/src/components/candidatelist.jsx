import React, { useState, useEffect } from 'react';
import ApplicantListItem from './candidatelistitem';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/pagination.css'; // Ensure you import the custom CSS

function CandidateList({ searchParams = {}, isRecommended }) {
  const [allApplicants, setAllApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [recommendedApplicants, setRecommendedApplicants] = useState([]);
  const [filteredRecommendedApplicants, setFilteredRecommendedApplicants] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [applicantsPerPage] = useState(10);

  // Fetch all applicants
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setError(null);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/applicants/applicantlist`);
        if (!response.ok) {
          throw new Error(`Failed to fetch applicants: ${response.status}`);
        }
        const data = await response.json();
        setAllApplicants(data);
        setFilteredApplicants(data);
      } catch (error) {
        console.error('Error fetching applicants:', error);
        setError('Failed to load applicants.');
      }
    };

    if (!isRecommended) {
      fetchApplicants();
      setRecommendedApplicants([]); // Clear recommended applicants when not in the recommended tab
    }
  }, [isRecommended]);

  // Fetch recommended candidates
  useEffect(() => {
    const fetchRecommendedCandidates = async () => {
      const userId = sessionStorage.getItem('user_id');

      try {
        setError(null);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recommend-candidates`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch recommended candidates: ${response.status}`);
        }

        const data = await response.json();

        if (data.recommendations && data.recommendations.length > 0) {
          setRecommendedApplicants(data.recommendations);
          setFilteredRecommendedApplicants(data.recommendations);
        } else {
          setError('No recommended candidates found.');
        }
      } catch (error) {
        console.error('Error fetching recommended candidates:', error);
        setError('No job listings available. Recommendations cannot be generated.');
      }
    };

    if (isRecommended) {
      fetchRecommendedCandidates();
      setFilteredApplicants([]); // Clear filtered applicants when in the recommended tab
    }
  }, [isRecommended]);

  // Apply filters based on searchParams
  useEffect(() => {
    const { searchQuery = '', selectedIndustry = '' } = searchParams;

    const filterCandidates = (candidates) =>
      candidates.filter((applicant) => {
        const matchesSearchQuery =
          !searchQuery ||
          applicant.latest_job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          applicant.full_name?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesIndustry =
          !selectedIndustry ||
          applicant.industry_id === parseInt(selectedIndustry, 10) || // Numeric match
          applicant.industry_id?.toString() === selectedIndustry; // String match

        return matchesSearchQuery && matchesIndustry;
      });

    if (isRecommended) {
      setFilteredRecommendedApplicants(filterCandidates(recommendedApplicants));
    } else {
      setFilteredApplicants(filterCandidates(allApplicants));
    }
  }, [searchParams, allApplicants, recommendedApplicants, isRecommended]);

  // Pagination logic
  const indexOfLastApplicant = currentPage * applicantsPerPage;
  const indexOfFirstApplicant = indexOfLastApplicant - applicantsPerPage;
  const currentApplicants = isRecommended
    ? filteredRecommendedApplicants.slice(indexOfFirstApplicant, indexOfLastApplicant)
    : filteredApplicants.slice(indexOfFirstApplicant, indexOfLastApplicant);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalApplicants = isRecommended
    ? filteredRecommendedApplicants.length
    : filteredApplicants.length;

  return (
    <div>
      <h3>{isRecommended ? 'Recommended Candidates' : 'All Candidates'}</h3>
      {error ? (
        <div className="alert alert-info mt-3" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          <strong>{error}</strong>
        </div>
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
        <p>No candidates available</p>
      )}
    </div>
  );
}

const Pagination = ({ applicantsPerPage, totalApplicants, paginate, currentPage }) => {
  const totalPages = Math.ceil(totalApplicants / applicantsPerPage);
  const maxPagesVisible = 5;
  const pageNumbers = [];

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesVisible - 1);

  if (endPage - startPage + 1 < maxPagesVisible) {
    startPage = Math.max(1, endPage - maxPagesVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination justify-content-center">
        {currentPage > 1 && (
          <li className="page-item">
            <a onClick={() => paginate(currentPage - 1)} href="#!" className="page-link">
              {'<<'}
            </a>
          </li>
        )}
        {pageNumbers.map((number) => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <a onClick={() => paginate(number)} href="#!" className="page-link">
              {number}
            </a>
          </li>
        ))}
        {currentPage < totalPages && (
          <li className="page-item">
            <a onClick={() => paginate(currentPage + 1)} href="#!" className="page-link">
              {'>>'}
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default CandidateList;

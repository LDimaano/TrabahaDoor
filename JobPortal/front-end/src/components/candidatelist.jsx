import React, { useState, useEffect } from 'react';
import ApplicantListItem from './candidatelistitem';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/pagination.css'; // Ensure you import the custom CSS

function CandidateList({ searchParams = {}, isRecommended }) {
  const [allApplicants, setAllApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [recommendedApplicants, setRecommendedApplicants] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [applicantsPerPage] = useState(10); // Set the number of applicants per page

  // Fetch all applicants when the component mounts
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setError(null); // Clear error before fetching applicants
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/applicants/applicantlist`);
        if (!response.ok) {
          throw new Error(`Failed to fetch applicants: ${response.status}`);
        }
        const data = await response.json();
        setAllApplicants(data);
        setFilteredApplicants(data); // Initially set filtered applicants to all applicants
      } catch (error) {
        console.error('Error fetching applicants:', error);
        setError('Failed to load applicants.');
      }
    };

    if (!isRecommended) {
      fetchApplicants();
      setRecommendedApplicants([]); // Clear recommended applicants when switching tabs
    }
  }, [isRecommended]);

  // Apply filters to the candidates whenever searchParams change
  useEffect(() => {
    if (!isRecommended) {
      const { searchQuery = '', selectedIndustry = '' } = searchParams;
      console.log('Search Query:', searchQuery);
      console.log('Selected Industry:', selectedIndustry);
      const filtered = allApplicants.filter((applicant) => {
        const matchesSearchQuery =
          searchQuery === '' ||
          applicant.latest_job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          applicant.full_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesIndustry =
          selectedIndustry === '' || applicant.industry_id === parseInt(selectedIndustry);

        return matchesSearchQuery && matchesIndustry;
      });
      setFilteredApplicants(filtered);
    }
  }, [searchParams, allApplicants, isRecommended]);

  // Fetch recommended candidates when the 'Recommended' tab is active
  useEffect(() => {
    const fetchRecommendedCandidates = async () => {
      const userId = sessionStorage.getItem('user_id'); // Get user ID from session storage
      console.log('User ID for recommendations:', userId); // Log the user ID

      try {
        setError(null); // Clear error before fetching recommended candidates
        // Fetch recommended candidates
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recommend-candidates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch recommended candidates: ${response.status}`);
        }

        const data = await response.json();
        console.log('Recommended candidates data:', data); // Log the recommended candidates data

        if (data.recommendations && data.recommendations.length > 0) {
          setRecommendedApplicants(data.recommendations);
        } else if (data.recommendations && data.recommendations.length === 0) {
          setError('No recommended candidates found. It seems the job listing is empty.');
        } else {
          setError('No recommendations found.');
        }
      } catch (error) {
        console.error('Error fetching recommended candidates:', error);
        setError('No job listings available. Recommendations cannot be generated.');
      }
    };

    if (isRecommended) {
      fetchRecommendedCandidates();
      setFilteredApplicants([]); // Clear filtered applicants when switching to recommended
    }
  }, [isRecommended]);

  const indexOfLastApplicant = currentPage * applicantsPerPage;
  const indexOfFirstApplicant = indexOfLastApplicant - applicantsPerPage;
  const currentApplicants = isRecommended
    ? recommendedApplicants.slice(indexOfFirstApplicant, indexOfLastApplicant)
    : filteredApplicants.slice(indexOfFirstApplicant, indexOfLastApplicant);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalApplicants = isRecommended ? recommendedApplicants.length : filteredApplicants.length;

  return (
    <div>
      {isRecommended ? (
        <>
          <h3>Recommended Candidates</h3>
          {error ? (
             <div className="alert alert-warning mt-3" role="alert">
             <i className="fas fa-exclamation-circle me-2"></i> {/* Font Awesome alert icon */}
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
  const totalPages = Math.ceil(totalApplicants / applicantsPerPage);
  const maxPagesVisible = 5;
  const pageNumbers = [];

  // Calculate start and end pages to show up to 5 pages
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesVisible - 1);

  if (endPage - startPage + 1 < maxPagesVisible) {
    startPage = Math.max(1, endPage - maxPagesVisible + 1);
  }

  // Create the range of page numbers based on startPage and endPage
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

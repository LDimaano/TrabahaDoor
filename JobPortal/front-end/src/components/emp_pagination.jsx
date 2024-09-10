// src/components/Pagination.js
import React from 'react';

const Pagination = ({ applicantsPerPage, totalApplicants, paginate, currentPage }) => {
  const pageNumbers = Array.from({ length: Math.ceil(totalApplicants / applicantsPerPage) }, (_, index) => index + 1);

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;

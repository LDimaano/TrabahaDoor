import React from 'react';

const Pagination = ({ listingsPerPage, totalListings, paginate, currentPage }) => {
  const totalPages = Math.ceil(totalListings / listingsPerPage);
  const pageNumbers = [];

  // Define the range of pages to show around the current page
  const maxPageButtons = 5; // Adjust this number based on how many page numbers you want to display at once
  const startPage = Math.max(2, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages - 1, currentPage + Math.floor(maxPageButtons / 2));

  // Add the first page
  if (totalPages > 1) {
    pageNumbers.push(1);
  }

  // Add page numbers around the current page
  if (startPage > 2) {
    pageNumbers.push('...');
  }
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  if (endPage < totalPages - 1) {
    pageNumbers.push('...');
  }

  // Add the last page
  if (totalPages > 1) {
    pageNumbers.push(totalPages);
  }

  return (
    <nav>
      <ul className="pagination">
        {/* Previous button */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button onClick={() => paginate(currentPage - 1)} className="page-link">
            Previous
          </button>
        </li>

        {/* Page numbers */}
        {pageNumbers.map((number, index) => (
          <li
            key={index}
            className={`page-item ${number === currentPage ? 'active' : ''} ${number === '...' ? 'disabled' : ''}`}
          >
            {number === '...' ? (
              <span className="page-link">...</span>
            ) : (
              <button onClick={() => paginate(number)} className="page-link">
                {number}
              </button>
            )}
          </li>
        ))}

        {/* Next button */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button onClick={() => paginate(currentPage + 1)} className="page-link">
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;

import React from 'react';

function Pagination() {
  return (
    <nav className="d-flex justify-content-center my-4">
      <ul className="pagination">
        <li className="page-item">
          <a className="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        {[1, 2, 3, 4, 5, '...', 33].map((page, index) => (
          <li key={index} className={`page-item ${page === 1 ? 'active' : ''}`}>
            <a className="page-link" href="#">{page}</a>
          </li>
        ))}
        <li className="page-item">
          <a className="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;

import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function TopHiringList({ title }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch top hiring industries from the backend

  useEffect(() => {
    const fetchTopIndustries = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/topindustries`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const items = await response.json();
        
        // Check if data is not empty
        if (items && items.length > 0) {
          setItems(items);
        }
        // If data is empty, do nothing and keep the current employers state

      } catch (error) {
        setError(error.message);
        console.error('Error fetching employers:', error);
      }
    };

    fetchTopIndustries();
  }, []);
  
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className="card p-3 shadow-sm"> {/* Reduced padding */}
      <h2 className="h6 text-dark">{title}</h2> {/* Reduced font size */}
      <ul className="list-unstyled mt-2"> {/* Reduced top margin */}
        {items.map((item, index) => (
          <li key={index} className="d-flex align-items-center justify-content-between mb-2"> {/* Reduced bottom margin */}
            <span className="text-dark flex-grow-1">{item.industry_name}</span>
            <span className="fw-bold">{item.job_count}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TopHiringList;

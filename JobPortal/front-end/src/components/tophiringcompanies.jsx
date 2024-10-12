import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function TopHiringList({ title }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch top hiring companies from the backend
  useEffect(() => {
    const fetchTopCompanies = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/topcompanies`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include credentials for session-based authentication
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const items = await response.json();
        
        if (items && items.length > 0) {
          setItems(items);
        }
      } catch (error) {
        setError(error.message);
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopCompanies();
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className="card p-3 shadow-sm">
      <h2 className="h6 text-dark">{title}</h2>
      <ul className="list-unstyled mt-2">
        {items.map((item, index) => (
          <li key={index} className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center">
              <img 
                src={item.profile_picture_url} 
                alt={`${item.company_name} logo`} 
                style={{ width: '40px', height: '40px', marginRight: '10px', borderRadius: '50%' }} 
              />
              <span className="text-dark flex-grow-1">{item.company_name}</span>
            </div>
            <span className="fw-bold">{item.job_count}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TopHiringList;

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidepanel_notapprove';
import 'bootstrap/dist/css/bootstrap.min.css';

const WaitForApproval = () => {
  const [dateSubmitted, setDateSubmitted] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDateSubmitted = async () => {
      try {
        const userId = sessionStorage.getItem('user_id');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employers/approval-date/${userId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setDateSubmitted(data.dateSubmitted);
      } catch (error) {
        console.error('Error fetching date submitted:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDateSubmitted();
  }, []);

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="container p-4">
        <h1 className="text-center">Wait for Approval</h1>
        <div className="alert alert-info text-center" role="alert">
          Please wait for the admin approval.
        </div>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <p className="text-center">
            Your documents were submitted on: {dateSubmitted || 'N/A'}
          </p>
        )}
        <p className="text-center">
          Wait for 3-5 business days for admin approval. <br />
          For further questions, contact: 
          <a href="mailto:trabahadoor.sanjose@gmail.com"> trabahadoor.sanjose@gmail.com</a>
        </p>
      </div>
    </div>
  );
};

export default WaitForApproval;

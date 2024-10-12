import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [company_name, setCompanyName] = useState(''); 
  const [contact_person, setContactPerson] = useState('');
  const [profile_picture_url, setProfilePictureUrl] = useState('');

  const handlePostJobClick = () => {
    navigate('/jobposting');
  };

  useEffect(() => {
    const fetchCompanyName = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employers/user-infoemp`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('API response data:', data); 
          setCompanyName(data.company_name || '');
          setContactPerson(data.contact_person || '');
          setProfilePictureUrl(data.profile_picture_url || '');
        } else {
          console.error('Failed to fetch company name:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching company name:', error);
      }
    };

    fetchCompanyName();
  }, []);

  return (
    <header className="d-flex justify-content-between align-items-center mb-4">
      <div className="d-flex align-items-center">
        <img
          src={profile_picture_url}
          alt="Company Logo"
          className="me-3"
          style={{ width: '50px' }}
        />
        <div>
          <span className="text-muted">{contact_person}</span>
          <h2>{company_name}</h2>
        </div>
      </div>
      <div className="d-flex align-items-center">
        <button className="btn btn-primary" onClick={handlePostJobClick}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Post a job
        </button>
      </div>
    </header>
  );
};

export default Header;
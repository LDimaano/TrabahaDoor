import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/empheader';
import EmployerProfile from '../../components/emp_profile';
import EmployerCard from '../../components/emp_card';

const MyProfile = () => {
  const navigate = useNavigate(); // For navigation

  const handleBack = () => {
    navigate(-1); // Navigate back
  };
  const [employerData, setEmployerData] = useState({});
  const [companyData, setCompanyData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = sessionStorage.getItem('user_id'); // Fetch user ID from session

    const fetchEmployerData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employers/fetchemployer-profile/${userId}`, {
          method: 'GET', // Specify the method
          credentials: 'include', // Include credentials (cookies)
          headers: {
            'Content-Type': 'application/json', // Set the content type
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch employer data');
        }
        const data = await response.json();

        console.log('Fetched Data:', data);

        console.log('Employer Data:', data.employer);

        // Set the state for employer data
        const newEmployerData = {
          companyname: data.employer.company_name || 'Not Provided',
          contactperson: data.employer.contact_person || 'Not Specified',
          image: data.employer.profilePicture,
          email: data.employer.email || 'Not Provided',
          phone: data.employer.contact_number || 'Not Provided',
          website: data.employer.website || 'Not Provided'
        };
        setEmployerData(newEmployerData);
        console.log('Updated Employer Data:', newEmployerData); // Debugging console log

        // Set the state for company data
        const newCompanyData = {
          company_name: data.employer.company_name ||  'Not Provided',
          company_address: data.employer.company_address || 'Not Provided',
          industry: data.employer.industry || 'Not Provided',
          company_size: data.employer.company_size || 'Not Provided',
          founded_year: data.employer.foundedYear || 'Not Provided',
          description: data.employer.description || 'Not Provided'
        };
        setCompanyData(newCompanyData);
        console.log('Updated Company Data:', newCompanyData); // Debugging console log

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching employer data:', error);
        setIsLoading(false);
      }
    };

    fetchEmployerData();
  }, []);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 p-4 container">
        <section>
          <h3 className="mb-4 d-flex align-items-center">
            <button
              className="btn p-0 me-3"
              onClick={handleBack}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#000',
                fontSize: '1.5rem',
                cursor: 'pointer',
              }}
              aria-label="Go back"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            My Profile
          </h3>
          <div className="d-flex">
            <div className="flex-fill me-4">
              <EmployerProfile companyData={companyData} />
            </div>
            <EmployerCard applicant={employerData} />
          </div>
        </section>
      </main>
    </div>
  );
}


export default MyProfile;
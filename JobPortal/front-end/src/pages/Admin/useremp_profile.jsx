import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import EmployerProfile from '../../components/emp_profile';
import EmployerCard from '../../components/emp_card';

const MyProfile = () => {
  const navigate = useNavigate();
  const { user_id } = useParams();
  const [employerData, setEmployerData] = useState({});
  const [companyData, setCompanyData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchEmployerData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/employerprofile/${user_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch employer data');
        }
        const data = await response.json();

        setEmployerData({
          companyname: data.employer.company_name || 'Not Provided',
          contactperson: data.employer.contact_person || 'Not Specified',
          image: data.employer.profilePicture,
          email: data.employer.email || 'Not Provided',
          phone: data.employer.contact_number || 'Not Provided',
          website: data.employer.website || 'Not Provided',
        });

        setCompanyData({
          company_name: data.employer.company_name || 'Not Provided',
          company_address: data.employer.company_address || 'Not Provided',
          industry: data.employer.industry || 'Not Provided',
          company_size: data.employer.company_size || 'Not Provided',
          founded_year: data.employer.foundedYear || 'Not Provided',
          description: data.employer.description || 'Not Provided',
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching employer data:', error);
        setIsLoading(false);
      }
    };

    fetchEmployerData();
  }, [user_id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
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
          <div className="row">
            <div className="col-12 col-md-8 mb-4 mb-md-0">
              <EmployerProfile companyData={companyData} />
            </div>
            <div className="col-12 col-md-4">
              <EmployerCard applicant={employerData} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MyProfile;

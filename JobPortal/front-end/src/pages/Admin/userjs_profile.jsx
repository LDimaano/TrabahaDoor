import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ApplicantProfile from '../../components/app_profile';
import ApplicantCard from '../../components/app_cardadmin';

const MyProfile = () => {
  const navigate = useNavigate();
  const { user_id } = useParams();
  const [applicantData, setApplicantData] = useState({});
  const [personalData, setPersonalData] = useState({});
  const [professionalData, setProfessionalData] = useState({
    currentJob: '',
    workExperience: [],
    skills: [],
    description: '',
    company: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchApplicantData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/applicantprofile/${user_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch applicant data');
        }
        const data = await response.json();
        console.log(data);

        setApplicantData({
          name: data.jobSeeker.full_name || 'Not Provided',
          profession: data.jobSeeker.job_title || 'Not Specified',
          image: data.jobSeeker.image,
          email: data.jobSeeker.email || 'Not Provided',
          phone: data.jobSeeker.phone_number || 'Not Provided',
        });

        setPersonalData({
          fullName: data.jobSeeker.full_name || 'Not Provided',
          dateOfBirth: data.jobSeeker.date_of_birth
            ? `${new Date(data.jobSeeker.date_of_birth).toLocaleDateString()} (${new Date().getFullYear() - new Date(data.jobSeeker.date_of_birth).getFullYear()} y.o)`
            : 'Not Provided',
          gender: data.jobSeeker.gender || 'Not Specified',
          address: data.jobSeeker.address || 'Address not provided',
          industry: data.jobSeeker.industry || 'Industry not provided',
        });

        const firstJobExperience = data.jobExperience[0] || {};

        setProfessionalData({
          currentJob: firstJobExperience.job_title || 'Not Specified',
          workExperience: data.jobExperience || [],
          skills: data.skills || [],
          description: firstJobExperience.description || 'No Description',
          company: firstJobExperience.company || 'No Company Provided',
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching applicant data:', error);
        setIsLoading(false);
      }
    };

    fetchApplicantData();
  }, [user_id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 p-4 container">
        <section>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
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
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              <h3 className="mb-0">Applicant's Profile</h3>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-8 mb-4 mb-md-0">
              <ApplicantProfile
                personalData={personalData}
                professionalData={professionalData}
              />
            </div>
            <div className="col-12 col-md-4">
              <ApplicantCard applicant={applicantData} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MyProfile;

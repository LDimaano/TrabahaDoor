import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useParams } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/empheader';
import ApplicantProfile from '../../components/app_profile';
import ApplicantCard from '../../components/app_card';

const MyProfile = () => {
  const navigate = useNavigate(); 
  const { user_id } = useParams(); // Use user_id to match the backend route
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

  // Function to handle the hire button click
  const handleHire = () => {
    // Add logic to handle hiring the applicant
    console.log("Hire button clicked. Proceed with hiring logic here.");
  };

  useEffect(() => {
    const fetchApplicantData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/applicants/applicantprofile/${user_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch applicant data');
        }
        const data = await response.json();
        console.log(data); 

        // Set the state for applicant data
        setApplicantData({
          name: data.jobSeeker.full_name || 'Not Provided',
          profession: data.jobSeeker.job_title || 'Not Specified',
          image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/3abeed5f2de2d8df2f096ae96cc50be8ac71d626c31b3c38ffa0141113466826', // Placeholder or actual image URL
          email: data.jobSeeker.email || 'Not Provided',
          phone: data.jobSeeker.phone_number || 'Not Provided',
        });

        // Set the state for personal data
        setPersonalData({
          fullName: data.jobSeeker.full_name || 'Not Provided',
          dateOfBirth: data.jobSeeker.date_of_birth 
            ? `${new Date(data.jobSeeker.date_of_birth).toLocaleDateString()} (${new Date().getFullYear() - new Date(data.jobSeeker.date_of_birth).getFullYear()} y.o)` 
            : 'Not Provided',
          gender: data.jobSeeker.gender || 'Not Specified',
          address: data.jobSeeker.address || 'Address not provided',
        });

        // Handle professional data
        const firstJobExperience = data.jobExperience[0] || {};

        setProfessionalData({
          currentJob: firstJobExperience.job_title || 'Not Specified',
          workExperience: data.jobExperience || [], // Use the entire array
          skills: data.skills || [], // Directly set skills array
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
  }, [user_id]); // Ensure user_id is a dependency

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
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
            <button className="btn btn-primary" onClick={handleHire}>
              Hire
            </button>
          </div>
          <div className="d-flex">
            <div className="flex-fill me-4">
              <ApplicantProfile
                personalData={personalData}
                professionalData={professionalData}
              />
            </div>
            <ApplicantCard applicant={applicantData} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default MyProfile;

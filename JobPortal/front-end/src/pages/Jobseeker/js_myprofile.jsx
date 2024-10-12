import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Header from '../../components/jsheader';
import ApplicantProfile from '../../components/app_profile';
import ApplicantCard from '../../components/app_card';

const MyProfile = () => {
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
  
  const navigate = useNavigate(); // Initialize useNavigate hook
  
  useEffect(() => {
    const userId = sessionStorage.getItem('user_id'); // Fetch user ID from session

    const fetchApplicantData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobseekers/job-seeker/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch applicant data');
        }
        const data = await response.json();

        const newApplicantData = {
          name: data.jobSeeker.full_name || 'Not Provided',
          profession: data.jobSeeker.job_title || 'Not Specified',
          image: data.jobSeeker.image,
          email: data.jobSeeker.email || 'Not Provided',
          phone: data.jobSeeker.phone_number || 'Not Provided',
        };
        setApplicantData(newApplicantData);

        const newPersonalData = {
          fullName: data.jobSeeker.full_name || 'Not Provided',
          dateOfBirth: data.jobSeeker.date_of_birth
            ? `${new Date(data.jobSeeker.date_of_birth).toLocaleDateString()} (${new Date().getFullYear() - new Date(data.jobSeeker.date_of_birth).getFullYear()} y.o)`
            : 'Not Provided',
          gender: data.jobSeeker.gender || 'Not Specified',
          address: data.jobSeeker.address || 'Address not provided',
          industry: data.jobSeeker.industry || 'Industry not provided',
        };
        setPersonalData(newPersonalData);

        const firstJobExperience = data.jobExperience[0] || {};
        const newProfessionalData = {
          currentJob: firstJobExperience.job_title || 'Not Specified',
          workExperience: data.jobExperience || [],
          skills: data.skills.map(skill => skill.skill_name) || [],
          description: firstJobExperience.description || 'No Description',
          company: firstJobExperience.company || 'No Company Provided',
        };
        setProfessionalData(newProfessionalData);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching applicant data:', error);
        setIsLoading(false);
      }
    };

    fetchApplicantData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleEditProfile = () => {
    const userId = sessionStorage.getItem('user_id'); // Retrieve userId from session storage
    navigate('/js_profile_edit', { 
      state: { 
        personalData, 
        professionalData, 
        userId // Pass userId in state
      } 
    });
  };
  
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 p-4 container">
        <section>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>My Profile</h3>
        
          </div>

          <div className="d-flex">
            <div className="flex-fill me-4">
              <ApplicantProfile personalData={personalData} professionalData={professionalData} />
            </div>
            <ApplicantCard applicant={applicantData} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default MyProfile;

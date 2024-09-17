import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    const userId = sessionStorage.getItem('user_id'); // Fetch user ID from session

    const fetchApplicantData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/jobseekers/job-seeker/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch applicant data');
        }
        const data = await response.json();

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
          dateOfBirth: data.jobSeeker.date_of_birth ? 
            `${new Date(data.jobSeeker.date_of_birth).toLocaleDateString()} (${new Date().getFullYear() - new Date(data.jobSeeker.date_of_birth).getFullYear()} y.o)` 
            : 'Not Provided',
          gender: data.jobSeeker.gender || 'Not Specified',
          address: data.jobSeeker.address || 'Address not provided',
          industry: data.jobSeeker.industry || 'Industry not provided'
        });

        // Handle professional data
        const firstJobExperience = data.jobExperience[0] || {};

        setProfessionalData({
          currentJob: firstJobExperience.job_title || 'Not Specified',
          workExperience: data.jobExperience || [], // Use the entire array
          skills: data.skills.map(skill => skill.skill_name) || [],
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
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 p-4 container">
        <section>
          <h3 className="mb-4">My Profile</h3>
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

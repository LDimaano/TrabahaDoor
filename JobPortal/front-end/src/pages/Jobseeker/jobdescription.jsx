import React, { useEffect, useState } from 'react';
import Header from '../../components/jsheader';
import ApplicantProfile from '../../components/app_profile';
import ApplicantCard from '../../components/app_card';

const MyProfile = () => {
  const [applicantData, setApplicantData] = useState(null);
  const [personalData, setPersonalData] = useState(null);
  const [professionalData, setProfessionalData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplicantData = async () => {
      try {
        const userId = sessionStorage.getItem('user_id');
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
          dateOfBirth: data.jobSeeker.date_of_birth ? new Date(data.jobSeeker.date_of_birth).toLocaleDateString() + ` (${new Date().getFullYear() - new Date(data.jobSeeker.date_of_birth).getFullYear()} y.o)` : 'Not Provided',
          gender: data.jobSeeker.gender || 'Not Specified',
          address: data.jobSeeker.address || 'Address not provided',
        });

        // Calculate work experience in years
        const calculateWorkExperience = (experiences) => {
          const totalYears = experiences.reduce((total, exp) => {
            const startYear = new Date(exp.start_date).getFullYear();
            const endYear = new Date(exp.end_date).getFullYear();
            return total + (endYear - startYear);
          }, 0);
          return `${totalYears} Years` || 'Not Specified';
        };

        // Set the state for professional data
        setProfessionalData({
          currentJob: data.jobSeeker.job_title || 'Not Specified',
          workExperience: calculateWorkExperience(data.jobExperience || []),
          skills: data.skills.map(skill => skill.skill_name) || [],
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

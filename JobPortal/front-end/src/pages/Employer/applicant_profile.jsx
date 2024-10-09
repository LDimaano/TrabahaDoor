import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useParams } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/empheader';
import ApplicantProfile from '../../components/app_profile';
import ApplicantCard from '../../components/app_cardforemp';

// Modal Component
const ConfirmModal = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '100%',
      }}>
        <h5>Confirm Contact</h5>
        <p>Are you sure you want to contact this applicant?</p>
        <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            className="btn btn-secondary" 
            onClick={onClose} 
            style={{ marginRight: '10px' }} // Add margin here for spacing
          >
            Cancel
          </button>
          <button className="btn btn-primary" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};


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
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const handleBack = () => {
    navigate(-1); 
  };

  // Function to handle the contact action
  const handleContact = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/applicants/contact/${user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
      });
  
      if (!response.ok) {
        const errorText = await response.text(); 
        throw new Error(`Failed to contact applicant: ${errorText}`);
      }
  
      const data = await response.json(); 
      console.log('Contact successful:', data);
    } catch (error) {
      console.error('Error contacting applicant:', error.message);
    }
  };

  // Function to handle modal confirmation
  const handleConfirmContact = () => {
    setIsModalOpen(false); // Close the modal
    handleContact(); // Execute contact action
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
          industry: data.jobSeeker.industry|| 'Industry not provided',
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
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              Contact
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

      {/* Modal for confirmation */}
      <ConfirmModal 
        show={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmContact} 
      />
    </div>
  );
};

export default MyProfile;

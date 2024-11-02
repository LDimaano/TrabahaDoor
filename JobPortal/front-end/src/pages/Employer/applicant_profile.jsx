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
  const [message, setMessage] = useState('');

  if (!show) return null;

  const handleConfirm = async () => {
    try {
      await onConfirm(message); // Call onConfirm with the message
      setMessage(''); // Clear the message input
      onClose(); // Close the modal after confirming
    } catch (error) {
      console.error('Error contacting applicant:', error);
    }
  };

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
        maxWidth: '90%', // Adjust width for mobile responsiveness
        width: '500px',
        margin: '0 20px', // Margin for smaller screens
      }}>
        <h5>Confirm Contact</h5>
        <p>Are you sure you want to contact this applicant?</p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message to the jobseeker..."
          style={{
            width: '100%',
            height: '80px',
            marginBottom: '20px',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ced4da',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={onClose} 
            style={{
              marginRight: '10px',
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm} // Use handleConfirm for the confirm action
            style={{
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              cursor: 'pointer',
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// Success Modal Component
const SuccessModal = ({ show, onClose, message }) => {
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
        maxWidth: '90%',
        width: '400px',
        margin: '0 20px',
      }}>
        <h5>Success</h5>
        <p>{message}</p>
        <button 
          onClick={onClose}
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            cursor: 'pointer',
            marginTop: '20px',
          }}
        >
          Close
        </button>
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
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // State for success modal
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  const handleBack = () => {
    navigate(-1); 
  };

  const handleContact = async (message) => {
    try {
      const userId = sessionStorage.getItem('user_id');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/applicants/contact/${user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({ userId, message }), 
      });
  
      if (!response.ok) {
        const errorText = await response.text(); 
        throw new Error(`Failed to contact applicant: ${errorText}`);
      }
  
      const data = await response.json(); 
      console.log('Contact successful:', data);
      setSuccessMessage('Successfully contacted the jobseeker!'); // Set the success message
      setIsSuccessModalOpen(true); // Open the success modal
    } catch (error) {
      console.error('Error contacting applicant:', error.message);
    }
  };

  useEffect(() => {
    const fetchApplicantData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/applicants/applicantprofile/${user_id}`);
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: '1', padding: '16px', width: '100%', maxWidth: '1200px', margin: 'auto' }}>
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <button
                onClick={handleBack}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#000', 
                  fontSize: '1.5rem', 
                  cursor: 'pointer',
                  marginRight: '16px',
                }}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              <h1>Applicant Profile</h1>
            </div>
          </div>
          <ApplicantProfile applicantData={applicantData} />
          <ApplicantCard
            applicantData={applicantData}
            personalData={personalData}
            professionalData={professionalData}
            setIsModalOpen={setIsModalOpen} 
          />
        </section>
      </main>
      <ConfirmModal
        show={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleContact} // Pass the handleContact function
      />
      <SuccessModal 
        show={isSuccessModalOpen} 
        onClose={() => setIsSuccessModalOpen(false)} 
        message={successMessage} 
      />
    </div>
  );
};

export default MyProfile;

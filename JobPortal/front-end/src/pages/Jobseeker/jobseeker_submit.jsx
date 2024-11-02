import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AdditionalInfo from '../../components/jssubmitaddinfo';
import JobHeader from '../../components/submitheader';
import Modal from '../../components/modal';
import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL);

function SubmitApplication() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [jobDetails, setJobDetails] = useState({});
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [hasApplied, setHasApplied] = useState(false);
    const [attachment, setAttachment] = useState(null);
    const [loading, setLoading] = useState(false); // Loading state for form submission
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const { jobId } = useParams();
    const user_id = sessionStorage.getItem('user_id');

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobs/joblistings/${jobId}`);
                if (!response.ok) throw new Error('Failed to fetch job details');
                const data = await response.json();
                setJobDetails(data);
            } catch (error) {
                console.error('Error fetching job details:', error);
            }
        };

        const checkIfApplied = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobs/applications/check`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ jobId, user_id }),
                });
                
                if (!response.ok) throw new Error('Failed to check application status');
                const data = await response.json();
                setHasApplied(data.applied); // Set application status directly
            } catch (error) {
                console.error('Error checking application status:', error);
            }
        };

        if (jobId && user_id) {
            fetchJobDetails();
            checkIfApplied();
        }

        socket.on('new-application', (data) => {
            console.log(data.message);
        });

        return () => {
            socket.off('new-application'); // Cleanup socket event listener
        };
    }, [jobId, user_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true

        const formData = new FormData();
        formData.append('jobId', jobId);
        formData.append('user_id', user_id);
        formData.append('additionalInfo', additionalInfo);
        
        if (attachment) {
            formData.append('resume', attachment); // Change 'attachment' to 'resume'
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobs/applications`, {
                method: 'POST',
                body: formData, // Send FormData directly
            });

            if (!response.ok) throw new Error('Failed to submit application');

            const result = await response.json();
            closeModal();
            setHasApplied(true);
            setSuccessMessage('Your application has been successfully submitted!'); // Set success message
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('Failed to submit the application. Please try again later.');
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    const modalContent = (
        <div className="container">
            <section className="mb-4">
                <JobHeader
                    logo={jobDetails.profile_picture_url || 'default-logo-url'}
                    title={jobDetails.job_title || 'Job Title'}
                    company={jobDetails.company_name || 'Company Name'}
                />
                <hr />
                <div className="mb-4 text-start">
                    <h2 className="h4">Submit your application</h2>
                    <p>Applying will share your information, such as <strong>email</strong> and <strong>phone number</strong>, with the employer.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <AdditionalInfo
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                    />
                    <div className="mb-3">
                        <label htmlFor="attachment" className="form-label d-flex align-items-center">
                            <i className="fas fa-paperclip me-2"></i>Attach your CV/Resume (PDF)
                        </label>
                        <input
                            type="file"
                            id="attachment"
                            accept="application/pdf" // Allow only PDF files
                            className="form-control"
                            onChange={(e) => setAttachment(e.target.files[0])}
                        />
                    </div>
                    <hr />
                    <button type="submit" className="btn btn-primary" disabled={hasApplied || loading}>
                        {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                    <p className="mt-3 text-start">
                        By sending the request you confirm that you accept our{" "}
                        <a href="#terms" className="link-primary">Terms of Service</a> and{" "}
                        <a href="#privacy" className="link-primary">Privacy Policy</a>
                    </p>
                </form>
            </section>
        </div>
    );

    return (
        <>
            <button
                onClick={openModal}
                className={`btn ${hasApplied ? 'btn-secondary' : 'btn-primary'}`}
                disabled={hasApplied}
            >
                {hasApplied ? 'Already Applied' : 'Apply Now'}
            </button>
            <Modal isOpen={isModalOpen} onClose={closeModal} content={modalContent} />
            {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
        </>
    );
}

export default SubmitApplication;

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
    const [attachmentUrl, setAttachmentUrl] = useState(''); // Stores uploaded file URL
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
                if (data.applied) setHasApplied(true);
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
            socket.off('new-application');
        };
    }, [jobId, user_id]);

    const handleFileUpload = async () => {
        if (!attachment) return;

        const formData = new FormData();
        formData.append('user_id', user_id);
        formData.append('attachment', attachment);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobs/upload-resume`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to upload resume');

            const data = await response.json();
            setAttachmentUrl(data.resumeUrl);
            console.log('Resume uploaded:', data.resumeUrl);
        } catch (error) {
            console.error('Error uploading resume:', error);
            alert('Failed to upload resume. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure the file is uploaded before submitting application
        if (attachment && !attachmentUrl) {
            await handleFileUpload();
        }

        const payload = {
            jobId,
            user_id,
            additionalInfo,
            resumeUrl: attachmentUrl,
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobs/applications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to submit application');

            const result = await response.json();
            alert(result.message || 'Application submitted successfully!');
            closeModal();
            setHasApplied(true);
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('Failed to submit the application. Please try again later.');
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
                    <p> Applying will share your information, such as <strong>email</strong> and <strong>phone number</strong>, with the employer.</p>
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
                            accept="application/pdf"
                            className="form-control"
                            onChange={(e) => setAttachment(e.target.files[0])}
                        />
                    </div>
                    <hr />
                    <button type="submit" className="btn btn-primary" disabled={hasApplied}>
                        Submit Application
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
        </>
    );
}

export default SubmitApplication;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FormField from '../../components/formfield';
import JobHeader from '../../components/submitheader';
import AdditionalInfo from '../../components/jssubmitaddinfo';
import Modal from '../../components/modal';

function SubmitApplication() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [jobDetails, setJobDetails] = useState({});
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const { jobId } = useParams();
    const user_id = sessionStorage.getItem('user_id');

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/jobs/joblistings/${jobId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch job details');
                }
                const data = await response.json();
                setJobDetails(data);
            } catch (error) {
                console.error('Error fetching job details:', error);
            }
        };

        if (jobId) {
            fetchJobDetails();
        }
    }, [jobId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({
            jobId,
            user_id,
            fullName,
            email,
            phoneNumber,
            additionalInfo,
        });

        try {
            const response = await fetch('http://localhost:5000/api/jobs/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobId,
                    user_id,
                    fullName,
                    email,
                    phoneNumber,
                    additionalInfo,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch {
                    errorData = { error: errorText };
                }
                throw new Error(errorData.error || 'An unexpected error occurred.');
            }

            const result = await response.json();
            alert(result.message || 'Application submitted successfully!');
            closeModal();
        } catch (error) {
            console.error('Error submitting application:', error);
            alert(error.message || 'Failed to submit the application. Please try again later.');
        }
    };

    const modalContent = (
        <div className="container">
            <section className="mb-4">
                <JobHeader
                    logo={jobDetails.logo || 'default-logo-url'}
                    title={jobDetails.job_title || 'Job Title'}
                    company={jobDetails.company_name || 'Company Name'}
                />
                <hr />
                <div className="mb-4 text-start">
                    <h2 className="h4">Submit your application</h2>
                    <p>The following is required and will only be shared with Nomad</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <FormField
                        label="Full name"
                        type="text"
                        placeholder="Enter your full name"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    <FormField
                        label="Email address"
                        type="email"
                        placeholder="Enter your email address"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <FormField
                        label="Phone number"
                        type="tel"
                        placeholder="Enter your phone number"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <hr />
                    <AdditionalInfo
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                    />
                    <hr />
                    <button type="submit" className="btn btn-primary">Submit Application</button>
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
            <button onClick={openModal} className="btn btn-primary">Apply Now</button>
            <Modal isOpen={isModalOpen} onClose={closeModal} content={modalContent} />
        </>
    );
}

export default SubmitApplication;

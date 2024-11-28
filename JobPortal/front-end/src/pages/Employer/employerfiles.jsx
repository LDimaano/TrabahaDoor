import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const UploadDocuments = () => {
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState(''); 
    const [formData, setFormData] = useState({
        sec_certificate: null,
        business_permit: null,
        bir_certificate: null,
        poea_license: null,
        private_recruitment_agency_license: null,
        contract_sub_contractor_certificate: null
    });

    const navigate = useNavigate();
    const user_id = window.location.pathname.split('/')[2]; 

    // Handle file change event
    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.files[0] 
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault(); 
        setShowModal(true); 
    };

    const handleConfirmSubmit = async () => {
        try {
            const form = new FormData();
    
            // Append all files to the FormData
            for (const key in formData) {
                if (formData[key]) {
                    form.append(key, formData[key]);
                    console.log(`Appending file: ${key} -> ${formData[key].name}`); 
                }
            }
    
            // Append the user ID
            form.append('user_id', user_id);
            console.log(` user_id document file upload: ${user_id}`); 
            
            // Send the form data to the server using await
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employers/upload/${user_id}`, { // Full backend URL
                method: 'POST',
                body: form
            });
    
            console.log('Response status:', response.status); 
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.text(); 
            console.log('Response data:', data); 
            
            setSuccessMessage('Document submitted successfully!'); 
            setShowModal(false); 
            setTimeout(() => {
                navigate('/waitapproval');
            }, 2000); 
        } catch (error) {
            console.error('Error:', error); 
            alert('Upload failed. Please try again.');
            setShowModal(false); 
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">Required Document Upload</h1>
            <h5 className="text-center mb-4">Ensure compliance by providing all required documents.</h5>
            
            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="sec_certificate" className="mb-4">
                    <Form.Label>SEC Certificate:</Form.Label>
                    <Form.Control type="file" name="sec_certificate" onChange={handleFileChange} required />
                    <Form.Text className="text-muted">
                        This document verifies your business as a registered entity with the Securities and Exchange Commission (SEC).
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="business_permit" className="mb-4">
                    <Form.Label>Business Permit:</Form.Label>
                    <Form.Control type="file" name="business_permit" onChange={handleFileChange} required />
                    <Form.Text className="text-muted">
                        This document shows your business is licensed to operate in your city or municipality.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="bir_certificate" className="mb-4">
                    <Form.Label>BIR Certificate of Registration:</Form.Label>
                    <Form.Control type="file" name="bir_certificate" onChange={handleFileChange} required />
                    <Form.Text className="text-muted">
                        This document confirms your registration with the Bureau of Internal Revenue (BIR) for tax purposes.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="poea_license" className="mb-4">
                    <Form.Label>POEA/DOLE License:</Form.Label>
                    <Form.Control type="file" name="poea_license" onChange={handleFileChange} required />
                    <Form.Text className="text-muted">
                        Required for recruitment agencies operating in the Philippines, ensuring compliance with the POEA/DOLE regulations.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="private_recruitment_agency_license" className="mb-4">
                    <Form.Label>Private Recruitment Agency License:</Form.Label>
                    <Form.Control type="file" name="private_recruitment_agency_license" onChange={handleFileChange} required />
                    <Form.Text className="text-muted">
                        This license is essential for agencies that provide recruitment services to job seekers and employers.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="contract_sub_contractor_certificate" className="mb-4">
                    <Form.Label>Contract/Sub-Contractor Certificate:</Form.Label>
                    <Form.Control type="file" name="contract_sub_contractor_certificate" onChange={handleFileChange} required />
                    <Form.Text className="text-muted">
                        This certificate verifies the legality of your business in engaging with sub-contractors.
                    </Form.Text>
                </Form.Group>

                <div className="d-flex justify-content-end mt-4">
                    <Button variant="primary" type="submit">Submit</Button>
                </div>
            </Form>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Submission</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to submit these documents?
                    <p className="mt-3 text-muted">
                        Once submitted, the approval process will take 3-5 business days. You will be notified once your documents are approved.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleConfirmSubmit}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UploadDocuments;

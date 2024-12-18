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
    const user_id = sessionStorage.getItem('user_id')
    console.log(user_id) 

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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employers/reupload/${user_id}`, { // Full backend URL
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
            
            // Delay navigation to show success message briefly
            setTimeout(() => {
                navigate('/login');
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
            <h5 className="text-center">Ensure compliance by providing all required documents.</h5>
            
            {/* Success Message */}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="sec_certificate">
                    <Form.Label>SEC Certificate:</Form.Label>
                    <Form.Control type="file" name="sec_certificate" onChange={handleFileChange} required />
                </Form.Group>

                <Form.Group controlId="business_permit">
                    <Form.Label>Business Permit:</Form.Label>
                    <Form.Control type="file" name="business_permit" onChange={handleFileChange} required />
                </Form.Group>

                <Form.Group controlId="bir_certificate">
                    <Form.Label>BIR Certificate of Registration:</Form.Label>
                    <Form.Control type="file" name="bir_certificate" onChange={handleFileChange} required />
                </Form.Group>

                <Form.Group controlId="poea_license">
                    <Form.Label>POEA/DOLE License:</Form.Label>
                    <Form.Control type="file" name="poea_license" onChange={handleFileChange} required />
                </Form.Group>

                <Form.Group controlId="private_recruitment_agency_license">
                    <Form.Label>Private Recruitment Agency License:</Form.Label>
                    <Form.Control type="file" name="private_recruitment_agency_license" onChange={handleFileChange} required />
                </Form.Group>

                <Form.Group controlId="contract_sub_contractor_certificate">
                    <Form.Label>Contract/Sub-Contractor Certificate:</Form.Label>
                    <Form.Control type="file" name="contract_sub_contractor_certificate" onChange={handleFileChange} required />
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

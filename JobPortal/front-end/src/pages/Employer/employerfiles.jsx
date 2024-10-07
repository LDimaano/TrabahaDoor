import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';

const UploadDocuments = () => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        sec_certificate: null,
        business_permit: null,
        bir_certificate: null,
        poea_license: null,
        private_recruitment_agency_license: null,
        contract_sub_contractor_certificate: null
    });

    const navigate = useNavigate();
    const { id } = useParams(); // Example of how you might use useParams

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.files[0] // Store the selected file
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        setShowModal(true); // Show the confirmation modal
    };

    const handleConfirmSubmit = () => {
        const form = new FormData();

        // Append all files to the FormData
        for (const key in formData) {
            if (formData[key]) {
                form.append(key, formData[key]);
            }
        }

        // Send the form data to the server (replace '/api/upload' with your endpoint)
        fetch('/api/upload', {
            method: 'POST',
            body: form
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(data => {
            alert(data); // Show success message
            setShowModal(false); // Close the modal
            navigate(`/next-page/${id}`); // Navigate to another page if needed
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Upload failed. Please try again.');
            setShowModal(false); // Close the modal in case of error
        });
    };

    return (
        <div className="container mt-5">
              <h1 className="text-center">Required Document Upload</h1>
              <h5 className="text-center">Ensure compliance by providing all required documents.</h5>
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
                    <Form.Label>POEA License:</Form.Label>
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

                {/* Submit Button at Lower Right */}
                <div className="d-flex justify-content-end mt-4">
                    <Button variant="primary" type="submit">Submit</Button>
                </div>
            </Form>

            {/* Confirmation Modal */}
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
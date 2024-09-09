import React from 'react';
import Modal from '../components/modal';

function TermsModal({ isOpen, onClose }) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      content={
        <div>
          <h2>Terms of Service</h2>
          <p><strong>Effective Date:</strong> 2025</p>
          <p>Welcome to Trabahadoor! These Terms of Service govern your use of our website provided by PESO San Jose. By accessing or using our Platform, you agree to be bound by these Terms. If you do not agree, please do not use our Platform.</p>
          <h3>Contact Us</h3>
          <p>If you have any questions about these Terms, please contact us at (email of sanjose).</p>
        </div>
      }
    />
  );
}

function PrivacyModal({ isOpen, onClose }) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      content={
        <div>
          <h2>Privacy Policy</h2>
          <p>[Insert your Privacy Policy Content here]</p>
        </div>
      }
    />
  );
}

export { TermsModal, PrivacyModal };

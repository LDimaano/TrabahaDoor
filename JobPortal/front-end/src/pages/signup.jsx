import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignupContainer from '../components/signupcontainer';
import SignupForm from '../components/signupform';
import { TermsModal, PrivacyModal } from '../components/termsandprivacy';

function Signup() {
  const [isTermsModalOpen, setTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setPrivacyModalOpen] = useState(false);

  const openTermsModal = (e) => {
    e.preventDefault();
    setTermsModalOpen(true);
  };

  const openPrivacyModal = (e) => {
    e.preventDefault();
    setPrivacyModalOpen(true);
  };

  const closeTermsModal = () => setTermsModalOpen(false);
  const closePrivacyModal = () => setPrivacyModalOpen(false);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="container">
        <div className="row">
          <SignupContainer />
          <SignupForm 
            openTermsModal={openTermsModal} 
            openPrivacyModal={openPrivacyModal} 
          />
        </div>
      </div>

      <TermsModal 
        isOpen={isTermsModalOpen} 
        onClose={closeTermsModal} 
      />
      <PrivacyModal 
        isOpen={isPrivacyModalOpen} 
        onClose={closePrivacyModal} 
      />
    </div>
  );
}

export default Signup;

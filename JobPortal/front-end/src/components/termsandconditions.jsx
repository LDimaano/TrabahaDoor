import React from "react";

function TermsAndConditions() {
  return (
    <div className="container-fluid" style={{ maxHeight: "60vh", overflowY: "auto" }}>
      <h2 className="mb-4 text-start">Terms and Conditions</h2>
      
      <p className="font-weight-bold">
        <strong>Effective Date:</strong> November 2024
      </p>

      <p>
        Welcome to TrabahaDoor! By accessing or using our website and services,
        you agree to be bound by these Terms and Conditions (“Terms”). Please
        read them carefully before using the Portal. If you do not agree to
        these Terms, you must not use the Portal.
      </p>

      <div className="mb-4">
        <h3 className="font-weight-bold">1. Acceptance of Terms</h3>
        <p>
          By using the Portal, you agree to comply with and be bound by these
          Terms and all applicable laws, regulations, and policies. These Terms
          apply to all users of the Portal, including job seekers, employers, and
          visitors.
        </p>
      </div>

      <div className="mb-4">
        <h3 className="font-weight-bold">2. Eligibility</h3>
        <p>
          <strong>Job Seekers:</strong> You must be at least 18 years old to
          create an account on the Portal. By using the Portal, you confirm that
          you meet this age requirement.
        </p>
        <p>
          <strong>Employers:</strong> Employers must be legally authorized to
          operate a business and hire individuals in accordance with applicable
          labor laws.
        </p>
      </div>

      <div className="mb-4">
        <h3 className="font-weight-bold">3. User Accounts</h3>
        <p>
          To access certain features of the Portal, you may need to create an
          account. You agree to provide accurate, current, and complete
          information during the registration process and to update such
          information as necessary.
        </p>
      </div>

      {/* Additional sections can be added below with the same layout */}
      
      <div className="mb-4">
        <h3 className="font-weight-bold">15. Contact Information</h3>
        <p>
          For any questions or concerns about these Terms, please contact us at:
        </p>
        <p>
          <strong>TrabahaDoor</strong>
          <br />
          Email:{" "}
          <a href="mailto:trabahadoor.sanjose@gmail.com">
            trabahadoor.sanjose@gmail.com
          </a>
          <br />
          Phone: (043) 779 8550
          <br />
          Address: San Jose Municipal Hall, San Jose, Batangas
        </p>
      </div>
    </div>
  );
}

export default TermsAndConditions;

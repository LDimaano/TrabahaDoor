import React from "react";

function TermsAndConditions() {
  return (
    <div className="container-fluid" style={{ maxHeight: "80vh", overflowY: "auto", padding: "20px" }}>
      
      <div className="text-muted mb-3">
        <p className="font-weight-bold">
          <strong>Effective Date:</strong> November 2024
        </p>
        <p>
          Welcome to TrabahaDoor! By accessing or using our website and services,
          you agree to be bound by these Terms and Conditions (“Terms”). Please
          read them carefully before using the Portal. If you do not agree to
          these Terms, you must not use the Portal.
        </p>
      </div>

      {/* Section 1: Acceptance of Terms */}
      <div className="mb-5">
        <h3 className="font-weight-bold text-secondary">1. Acceptance of Terms</h3>
        <p>
          By using the Portal, you agree to comply with and be bound by these
          Terms and all applicable laws, regulations, and policies. These Terms
          apply to all users of the Portal, including job seekers, employers, and
          visitors.
        </p>
      </div>

      {/* Section 2: Eligibility */}
      <div className="mb-5">
        <h3 className="font-weight-bold text-secondary">2. Eligibility</h3>
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

      {/* Section 3: User Accounts */}
      <div className="mb-5">
        <h3 className="font-weight-bold text-secondary">3. User Accounts</h3>
        <p>
          To access certain features of the Portal, you may need to create an
          account. You agree to provide accurate, current, and complete
          information during the registration process and to update such
          information as necessary.
        </p>
      </div>

      {/* Privacy Policy Section */}
      <div className="mb-5">
        <h3 className="font-weight-bold text-secondary">4. Privacy Policy</h3>
        <p>
          Your privacy is important to us. This Privacy Policy outlines the
          types of personal information that we collect and how it is used,
          stored, and protected. By using the Portal, you consent to the data
          practices described in this policy.
        </p>
        <p>
          <strong>Information We Collect:</strong> We collect personal data such
          as your name, contact information, job history, and other details
          necessary to provide our services effectively. This information is
          collected when you register for an account, apply for a job, or
          communicate with employers or job seekers.
        </p>
        <p>
          <strong>How We Use Your Information:</strong> We use the information
          collected to facilitate job searches, applications, and communications
          between employers and job seekers. We may also use your information
          for analytics, customer support, and to improve the services offered
          on the Portal.
        </p>
        <p>
          <strong>Data Security:</strong> We take appropriate measures to protect
          the security of your personal information, including the use of secure
          servers and encryption protocols. However, no method of transmission
          over the internet is 100% secure, and we cannot guarantee absolute
          security.
        </p>
        <p>
          <strong>Your Rights:</strong> You have the right to access, update,
          and delete your personal data. You can also choose to withdraw your
          consent for the use of your data at any time by contacting us.
        </p>
      </div>

      {/* Contact Information Section */}
      <div className="mb-5">
        <h3 className="font-weight-bold text-secondary">5. Contact Information</h3>
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

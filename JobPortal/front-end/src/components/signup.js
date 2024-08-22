import React, { useState } from 'react';
import '../css/login_signup.css';   
import { useNavigate } from 'react-router-dom';
import Modal from './modal'; 

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('jobseeker');
  const [isTermsModalOpen, setTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setPrivacyModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleClick = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, userType }),
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('Form submitted successfully:', result);
        if (userType === 'jobseeker') {
          navigate('/signup_jobseeker');
        } else {
          navigate('/signup_employer');
        }
      } else {
        console.error('Error submitting form:', result.error);
      }
    } catch (error) {
      console.error('Network or server error:', error);
    }
  };

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
    <section className="loginContainer">
      <div className="flexContainer">
        <LoginContainer />
        <form className="formContainer" onSubmit={handleClick}>
          <div className="loginForm">
            <h2 className="welcomeText">Sign up Now</h2>
            <div className="dividerSection">
              <div className="dividerLine" />
              <p className="dividerText">Sign up with email</p>
              <div className="dividerLine" />
            </div>
            <div className="forms">
              <label className="textFieldGroup">
                <span className="textFieldLabel">Email Address</span>
                <input 
                  type="email" 
                  className="textFieldInput" 
                  placeholder="Enter your Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="emailInput" 
                  aria-label="Enter your Email Address"
                />
              </label>
              <label className="textFieldGroup">
                <span className="textFieldLabel">Password</span>
                <input 
                  type="password" 
                  className="textFieldInput" 
                  placeholder="Enter password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="passwordInput" 
                  aria-label="Enter your password"
                />
              </label>
              <div className="userTypeContainer">
                <label className="radioGroup">
                  <input 
                    type="radio" 
                    name="userType" 
                    value="jobseeker" 
                    checked={userType === 'jobseeker'} 
                    onChange={() => setUserType('jobseeker')}
                  />
                  <span>Job Seeker</span>
                </label>
                <label className="radioGroup">
                  <input 
                    type="radio" 
                    name="userType" 
                    value="employer" 
                    checked={userType === 'employer'} 
                    onChange={() => setUserType('employer')}
                  />
                  <span>Employer</span>
                </label>
              </div>
              <button className="submitButton" type="submit">Continue</button>
            </div>
            <div className="alreadyAccount">
              <span>Already have an account?</span>
              <a href="/login" className="signUpLink">Log in</a>
            </div>
            <div className="alreadyAccount">
              <p>
                By clicking 'Continue', you acknowledge that you have read and accept the 
                <a href="/terms-of-service" className="signUpLink" onClick={openTermsModal}> Terms of Service</a> and 
                <a href="/privacy-policy" className="signUpLink" onClick={openPrivacyModal}> Privacy Policy</a>.
              </p>
            </div>
          </div>
        </form>
      </div>

      <Modal 
        isOpen={isTermsModalOpen} 
        onClose={closeTermsModal} 
        content={
          <div>
            <h2>Terms of Service</h2>
            <p><strong>Effective Date:</strong> 2025</p>
            <p>Welcome to Trabahadoor! These Terms of Service govern your use of our website provided by PESO San Jose. By accessing or using our Platform, you agree to be bound by these Terms. If you do not agree, please do not use our Platform.</p>
            <h3>1. Introduction</h3>
            <p>This Platform connects job seekers with employers. By registering an account or using our services, you agree to comply with these Terms and all applicable laws and regulations.</p>
            <h3>2. Eligibility</h3>
            <p>You must be at least 18 years old to use our Platform. By using our services, you represent that you have the legal capacity to enter into a binding agreement.</p>
            <h3>3. Account Registration</h3>
            <p>You are required to create an account to access certain features of the Platform. You agree to provide accurate and complete information during registration and to keep this information updated. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
            <h3>4. User Obligations</h3>
            <p>You agree not to post any false, misleading, or unlawful content on the Platform. You will not use the Platform to transmit any viruses, spam, or other harmful content. You will respect the privacy of other users and not use their personal information for any purpose other than job seeking or hiring.</p>
            <h3>5. Job Posting and Applications</h3>
            <p><strong>For Employers:</strong> Employers must ensure that all job postings are accurate and comply with applicable laws. Employers may not post jobs that involve unlawful activities or violate the rights of others.</p>
            <p><strong>For Job Seekers:</strong> Job seekers must provide truthful information in their resumes and applications. You may only apply for jobs that match your qualifications and experience.</p>
            <h3>6. Fees and Payments</h3>
            <p>Certain features of the Platform may require payment of fees. All fees are non-refundable unless otherwise stated. We reserve the right to change our fees at any time.</p>
            <h3>7. Privacy and Data Protection</h3>
            <p>We are committed to protecting your privacy. Please review our Privacy Policy to understand how we collect, use, and safeguard your information.</p>
            <h3>8. Intellectual Property</h3>
            <p>All content on the Platform, including text, graphics, logos, and software, is the property of TrabahaDoor or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works from any content on the Platform without our express permission.</p>
            <h3>9. Termination of Service</h3>
            <p>We reserve the right to suspend or terminate your account at any time, with or without notice, for any reason, including if you violate these Terms. Upon termination, your right to use the Platform will immediately cease.</p>
            <h3>10. Limitation of Liability</h3>
            <p>To the maximum extent permitted by law, PESO San Jose shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use of the Platform. Our total liability to you for any claim related to the use of the Platform shall not exceed the amount paid by you, if any, for accessing our services.</p>
            <h3>11. Governing Law</h3>
            <p>These Terms shall be governed by and construed in accordance with the laws of Philippines. Any legal action or proceeding related to these Terms shall be brought exclusively in the courts of Jurisdiction.</p>
            <h3>12. Amendments</h3>
            <p>We may update these Terms from time to time. We will notify you of any significant changes by posting the new Terms on our Platform. Your continued use of the Platform after such changes constitutes your acceptance of the new Terms.</p>
            <h3>13. Miscellaneous</h3>
            <p><strong>Severability:</strong> If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.</p>
            <p><strong>Entire Agreement:</strong> These Terms, along with our Privacy Policy, constitute the entire agreement between you and PESO San Jose regarding your use of the Platform.</p>
            <h3>Contact Us</h3>
            <p>If you have any questions about these Terms, please contact us at (email of sanjose).</p>
          </div>
        }
      />
      <Modal 
        isOpen={isPrivacyModalOpen} 
        onClose={closePrivacyModal} 
        content={
          <div>
            <h2>Privacy Policy</h2>
            <p>TrabahaDoor is committed to protecting the privacy of its users. This Privacy Policy outlines how we collect, use, disclose, and protect your personal information.</p>
            <p><strong>1. Information We Collect</strong></p>
            <p>We collect information from job seekers, employers, and website visitors.</p>
            <p><strong>Job Seekers:</strong> Name, email address, phone number, resume, cover letter, job preferences, work experience, education, skills, and other relevant information.</p>
            <p><strong>Employers:</strong> Company name, contact information, job postings, hiring preferences, and information about job applicants.</p>
            <p><strong>Website Visitors:</strong> IP address, browser type, and website usage information.</p>
            <p><strong>2. How We Use Your Information</strong></p>
            <p>Job Seekers: Match job seekers with suitable job openings, provide job alerts, and improve our services.</p>
            <p>Employers: Process job postings, facilitate communication with job seekers, and provide hiring analytics.</p>
            <p>Website Visitors: Enhance user experience, analyze website traffic, and improve our services.</p>
            <p><strong>3. Information Sharing</strong></p>
            <p>We may share your information with:</p>
            <p><strong>Third-Party Service Providers:</strong> We may use third-party service providers to help us operate our website and business, such as email marketing, payment processing, and data analytics.</p>
            <p><strong>Legal Requirements:</strong> We may disclose your information to comply with legal obligations, such as responding to subpoenas or court orders.</p>
            <p><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of our business, your information may be transferred to the new owner.</p>
            <p><strong>4. Data Security</strong></p>
            <p>We implement reasonable security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the internet or electronic storage is completely secure.</p>
            <p><strong>5. Your Choices</strong></p>
            <p>You have the right to access, correct, or delete your personal information. You can also opt-out of receiving marketing communications from us.</p>
            <p><strong>6. Children's Privacy</strong></p>
            <p>Our website is not intended for children under the age of 17. We do not knowingly collect personal information from children.</p>
            <p><strong>7. Changes to This Policy</strong></p>
            <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on our website.</p>
            <p><strong>8. Contact Us</strong></p>
            <p>If you have any questions about this Privacy Policy, please contact us at (Email of San Jose).</p>
            <p>By using our website, you consent to our collection and use of your information as described in this Privacy Policy.</p>
          </div>
        }
      />
    </section>
  );
}

function LoginContainer() {
  return (
    <div className="infoContainer">
      <img 
        src={`${process.env.PUBLIC_URL}/assets/jobfair.jpg`} 
        alt="Illustration of opportunities" 
        className="imageResponsive" 
        loading="lazy" 
      />
      <h1 className="headerText">Welcome to Trabahadoor!</h1>
      <p className="subHeaderText">See the opportunities awaiting for you</p>
    </div>
  );
}

export default Signup;

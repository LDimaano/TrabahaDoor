import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const JobPostingHeader = ({ companyName, jobTitle }) => (
  <header className="d-flex justify-content-between align-items-center p-3 border-bottom">
    <div className="d-flex align-items-center">
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/7bfd4e89c8afcd8bf4ff019356b512cd59d403f9a8316d7fb1b51aad7d2b6902?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
        alt="Company logo"
        className="me-3"
        style={{ maxWidth: '50px' }}
      />
      <div>
        <div className="fw-bold">{companyName}</div>
        <div className="d-flex align-items-center">
          <h1 className="mb-0">{jobTitle}</h1>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/094d56e22dd1b07143c6e0b7804b4e8167234f7715ffe38b80659cd99184a939?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
            alt="Verified badge"
            className="ms-2"
            style={{ maxWidth: '30px' }}
          />
        </div>
      </div>
    </div>
    <div className="d-flex align-items-center">
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/6dac324345bbc13698ac872cc77d9d263753bd48e8f7f2cbe129c409887b48dc?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
        alt="User profile"
        className="me-3"
        style={{ maxWidth: '40px', borderRadius: '50%' }}
      />
      <button className="btn btn-primary d-flex align-items-center">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/852e2efe240b1c9f07e77883f31c58ee205a3500bf21fea61c9a43cb4e07e5b7?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
          alt="Post job icon"
          className="me-2"
          style={{ maxWidth: '20px' }}
        />
        <span>Post a job</span>
      </button>
    </div>
  </header>
);

export default JobPostingHeader;

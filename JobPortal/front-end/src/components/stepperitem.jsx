import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const StepperItem = ({ imgSrc, stepNumber, title, isActive }) => (
  <div className={`d-flex align-items-center ${isActive ? 'text-primary' : ''}`}>
    <img loading="lazy" src={imgSrc} alt={`Step ${stepNumber} icon`} className="me-3" style={{ maxWidth: '30px' }} />
    <div>
      <div className="fw-bold">Step {stepNumber}</div>
      <div>{title}</div>
    </div>
  </div>
);

export default StepperItem;

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CheckboxGroup = ({ options }) => (
  <div className="mb-3">
    {options.map((option, index) => (
      <div key={index} className="form-check">
        <input type="checkbox" id={option.toLowerCase()} className="form-check-input" />
        <label htmlFor={option.toLowerCase()} className="form-check-label">{option}</label>
      </div>
    ))}
  </div>
);

export default CheckboxGroup;

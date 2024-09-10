import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dropdown = ({ label, options }) => (
  <div className="mb-3">
    <label htmlFor={label.toLowerCase()} className="form-label">{label}</label>
    <select id={label.toLowerCase()} className="form-select">
      {options.map((option, index) => (
        <option key={index} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

export default Dropdown;

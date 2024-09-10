import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const InputField = ({ label, placeholder, helperText }) => (
  <div className="mb-3">
    <label htmlFor={label.toLowerCase()} className="form-label">{label}</label>
    <input
      type="text"
      id={label.toLowerCase()}
      className="form-control"
      placeholder={placeholder}
    />
    {helperText && <div className="form-text">{helperText}</div>}
  </div>
);

export default InputField;

import React from 'react';

const FormField = ({ label, type, placeholder, id }) => {
  return (
    <div className="mb-3 text-start">
      <label htmlFor={id} className="form-label">{label}</label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className="form-control"
        aria-label={label}
      />
    </div>
  );
};

export default FormField;

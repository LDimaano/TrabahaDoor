import React from 'react';

const EducTag = ({ children }) => {
  return (
    <span
      className="badge me-2"
      style={{
        backgroundColor: '#0056b3', // Darker blue shade
        color: 'white',
        padding: '0.5em 1em',
        fontSize: '0.85rem',
        borderRadius: '8px',
      }}
    >
      {children}
    </span>
  );
};

export default EducTag;

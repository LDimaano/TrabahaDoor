import React from 'react';

const Tag = ({ children, color = 'primary' }) => {
  return (
    <span className={`badge bg-${color} me-2`}>{children}</span>
  );
};

export default Tag;

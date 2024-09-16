import React from 'react';

const KPI = ({ title, value, color }) => {
  return (
    <div className="kpi-card" style={{ backgroundColor: color, color: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '16px' }}>
      <h5 className="mb-0">{title}</h5>
      <p className="mb-0" style={{ fontSize: '24px', fontWeight: 'bold' }}>{value}</p>
    </div>
  );
};

export default KPI;
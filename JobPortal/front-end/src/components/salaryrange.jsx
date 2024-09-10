import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const SalaryRange = () => (
  <div className="mb-3">
    <div className="dropdown">
      <select id="Salary" className="form-select">
        <option value="below-15000">Below ₱15,000</option>
        <option value="15000-25000">₱15,000 - ₱25,000</option>
        <option value="25001-35000">₱25,001 - ₱35,000</option>
        <option value="35001-50000">₱35,001 - ₱50,000</option>
        <option value="50001-75000">₱50,001 - ₱75,000</option>
        <option value="75001-100000">₱75,001 - ₱100,000</option>
        <option value="above-100000">Above ₱100,000</option>
      </select>
    </div>
  </div>
);

export default SalaryRange;

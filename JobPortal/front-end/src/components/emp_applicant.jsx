// src/components/ApplicantTable.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const ApplicantTable = ({ applicants, currentApplicants, setApplicants }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingStatus, setEditingStatus] = useState('');
  const navigate = useNavigate();

  const handleStatusChange = (index, newStatus) => {
    const updatedApplicants = [...applicants];
    updatedApplicants[index].status = newStatus;
    setApplicants(updatedApplicants);
    setEditingIndex(null);
  };

  const handleSeeApplication = (applicant) => {
    navigate('/appdetails', { state: { applicant } });
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Hiring Stage</th>
            <th>Applied Date</th>
            <th>Job Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentApplicants.map((applicant, index) => (
            <tr key={index}>
              <td>
                <img src={applicant.avatar} alt={`${applicant.name}'s avatar`} className="me-2" style={{ width: '50px', borderRadius: '50%' }} />
                {applicant.name}
              </td>
              <td>
                {editingIndex === index ? (
                  <select
                    className="form-select"
                    value={editingStatus || applicant.status}
                    onChange={(e) => setEditingStatus(e.target.value)}
                    onBlur={() => handleStatusChange(index, editingStatus || applicant.status)}
                  >
                    <option value="Inreview">Inreview</option>
                    <option value="Declined">Declined</option>
                    <option value="Hired">Hired</option>
                  </select>
                ) : (
                  applicant.status
                )}
              </td>
              <td>{applicant.date}</td>
              <td>{applicant.role}</td>
              <td>
                <button className="btn btn-link" onClick={() => handleSeeApplication(applicant)}>
                  See Application
                </button>
                <FontAwesomeIcon icon={faEllipsisH} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicantTable;

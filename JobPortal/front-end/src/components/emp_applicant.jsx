import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ApplicantTable = ({ applicants, currentApplicants, setApplicants }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const navigate = useNavigate();

  const [statusOptions] = useState([
    { value: 'Applied', label: 'Applied' },
    { value: 'Interviewing', label: 'Interviewing' },
    { value: 'Offered', label: 'Offered' },
    { value: 'Hired', label: 'Hired' },
    { value: 'Rejected', label: 'Rejected' },
  ]);

  const handleStatusChange = (index, event) => {
    const newStatus = event.target.value;
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
                <img
                  src={applicant.avatar}
                  alt={`${applicant.name}'s avatar`}
                  className="me-2"
                  style={{ width: '50px', borderRadius: '50%' }}
                />
                {applicant.name}
              </td>
              <td>
                <select
                  className="form-select"
                  value={applicant.status}
                  onChange={(event) => handleStatusChange(index, event)}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </td>
              <td>{applicant.date}</td>
              <td>{applicant.role}</td>
              <td>
                <button className="btn btn-link" onClick={() => handleSeeApplication(applicant)}>
                  See Application
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicantTable;

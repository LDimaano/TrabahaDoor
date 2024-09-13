import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Tag from './jstag';

const JobDetails = ({ jobInfo, skills }) => {
  const [fetchedSkills, setFetchedSkills] = useState([]);
  const { jobId } = useParams();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        // Fetch job details including skills from the API
        const response = await fetch(`http://localhost:5000/api/joblistings/${jobId}`);
        const data = await response.json();
        setFetchedSkills(data.skills || []); // Ensure data.skills is always an array
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    if (jobId) {
      fetchSkills();
    }
  }, [jobId]);

  return (
    <aside className="col-md-4">
      <section className="mb-4">
        <h2>About this role</h2>
        {jobInfo.map(({ label, value }) => (
          <div key={label} className="d-flex justify-content-between mb-2">
            <span>{label}</span>
            <span className="fw-bold">{value}</span>
          </div>
        ))}
      </section>
      <hr />
      <section>
        <h2>Required Skills</h2>
        <div className="d-flex flex-wrap">
          {(skills.length > 0 ? skills : fetchedSkills).map((skill, index) => (
            <Tag key={index}>{skill}</Tag>
          ))}
        </div>
      </section>
    </aside>
  );
};

export default JobDetails;

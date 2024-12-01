import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Tag from './jstag';

const JobContent = ({ jobdescription, responsibilities, qualifications, educations }) => {
  const [fetchedEducations, setFetchedEducations] = useState([]);
  const { jobId } = useParams();

  useEffect(() => {
    const fetchEducations = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobs/joblistings/${jobId}`);
        const data = await response.json();
        setFetchedEducations(data.educations || []); 
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    if (jobId) {
      fetchEducations();
    }
  }, [jobId]);
  
  
  return (
    <div className="col-md-8">
      <section className="mb-4">
        <h2 className="text-dark border-bottom pb-2">Description</h2>
        <p className="text-muted fs-5">{jobdescription}</p>
      </section>
      <section className="mb-4">
        <h2 className="text-dark border-bottom pb-2">Responsibilities</h2>
        {/* Display responsibilities as a single string */}
        <p className="text-muted fs-5">{responsibilities}</p>
      </section>
      <section>
        <h2 className="text-dark border-bottom pb-2">Qualifications</h2>
        {/* Display qualifications as a single string */}
        <p className="text-muted fs-5">{qualifications}</p>
        <div className="d-flex flex-wrap" style={{ gap: '8px' }}> 
          {(educations.length > 0 ? educations : fetchedEducations).map((educations, index) => (
            <Tag key={index} style={{ marginBottom: '8px' }}>{educations}</Tag> 
          ))}
        </div>
      </section>
    </div>
  );
};

export default JobContent;

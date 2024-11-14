import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/login');
  };

  return (
    <section className="bg-light py-5" style={{ padding: '3rem 0', backgroundColor: '#eef2f7' }}>
      <div className="container">
        <div className="row align-items-center">
          {/* Text Content */}
          <div className="col-lg-6 col-md-12 text-center text-lg-start mb-4 mb-lg-0">
            <h1 className="display-4" style={{ fontWeight: '700', marginBottom: '1.5rem' }}>
              OPENING <br />
              <span style={{ color: '#007bff' }}>Opportunities</span> <br />
              <span style={{ color: '#6c757d' }}>for all</span>
            </h1>
            <p className="lead" style={{ color: '#555', marginBottom: '2rem' }}>
              Your Gateway to Career Opportunities! Opening doors to a brighter future with the Public Employment Service Office of San Jose, Batangas. Explore, Apply, Succeed!
            </p>
            <button 
              className="btn btn-primary btn-lg" 
              onClick={handleButtonClick} 
              style={{ backgroundColor: '#007bff', border: 'none', padding: '0.75rem 2rem' }}
            >
              Get Started
            </button>
          </div>
          
          {/* Image Content */}
          <div className="col-lg-6 col-md-12 text-center">
            <img
              src="/assets/jobfair.jpg"
              alt="People working together"
              className="img-fluid"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

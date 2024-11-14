import React from 'react';

const AboutUs = () => {
  return (
    <section className="py-5" style={{ backgroundColor: '#f9f9f9', padding: '2rem 0' }}>
      <div className="container">
        <div className="row align-items-center">
          {/* Image Section */}
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <img
                src="/assets/about.jpg"
                className="img-fluid"
                alt="PESO San Jose office or team members"
                style={{ maxWidth: '100%', height: 'auto', maxHeight: '420px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
              />
            </div>
          </div>

          {/* Text Content Section */}
          <div className="col-lg-6">
            <h2 style={{ marginBottom: '1.5rem', fontWeight: '700' }}>About <strong>PESO San Jose</strong></h2>
            <p style={{ color: '#6c757d' }}>The Public Employment Service Office (PESO) of San Jose, Batangas, is dedicated to assisting job seekers, including students, indigents, and persons with disabilities (PWDs), in finding employment opportunities.</p>
            <p style={{ color: '#6c757d' }}>PESO San Jose Batangas offers job fairs, skills training, and career counseling, supporting the local workforce and economic development.</p>
            <button style={{ marginTop: '1rem', backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '5px', cursor: 'pointer' }} onClick={() => window.location.href = 'https://www.facebook.com/sanjosebatangasPESO'}>Explore More</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

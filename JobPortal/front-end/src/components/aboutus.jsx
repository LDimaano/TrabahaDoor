import React from 'react';

const AboutUs = () => {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/bc8ceb35ea27108f4f8c5a04de801c84eeec28ac0633cc84f8307834cd82482c?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
              className="img-fluid"
              alt="PESO San Jose office or team members"
              style={{ maxWidth: '100%', height: 'auto', maxHeight: '420px' }}
            />
          </div>
          <div className="col-lg-6">
            <h2>About <strong>PESO San Jose</strong></h2>
            <p>The Public Employment Service Office (PESO) of San Jose, Batangas, is dedicated to assisting job seekers, including students, indigents, and persons with disabilities (PWDs), in finding employment opportunities.</p>
            <p>PESO San Jose Batangas offers job fairs, skills training, and career counseling, supporting the local workforce and economic development.</p>
            <button className="btn btn-primary" onClick={() => window.location.href = 'https://www.facebook.com/sanjosebatangasPESO'}>Explore More</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

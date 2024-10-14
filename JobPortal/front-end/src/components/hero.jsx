import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/login');
  };

  return (
    <section className="bg-light py-5">
      <div className="container">
        <div className="row align-items-center">
          {/* Text Content */}
          <div className="col-lg-6 col-md-12 text-center text-lg-start mb-4 mb-lg-0">
            <h1 className="display-4">
              OPENING <br />
              <span className="text-primary">Opportunities</span> <br />
              <span className="text-secondary">for all</span>
            </h1>
            <p className="lead">
              Your Gateway to Career Opportunities! Opening doors to a brighter future with the Public Employment Service Office of San Jose, Batangas. Explore, Apply, Succeed!
            </p>
            <button className="btn btn-primary btn-lg" onClick={handleButtonClick}>
              Get Started
            </button>
          </div>
          
          {/* Image Content */}
          <div className="col-lg-6 col-md-12 text-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/dd4529adb83c64e54d505e5c50c741ae2faae77894b272c18394f2ee1c7392ee?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
              alt="People working together"
              className="img-fluid"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

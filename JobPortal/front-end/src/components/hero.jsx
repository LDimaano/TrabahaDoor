import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/j_profilecreation');
  };

  return (
    <section className="bg-light py-5">
      <div className="container d-flex align-items-center">
        <div className="text-content me-4">
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
        <div className="image-content">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/dd4529adb83c64e54d505e5c50c741ae2faae77894b272c18394f2ee1c7392ee?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
            alt="People working together"
            className="img-fluid"
            style={{ maxWidth: '500px', height: 'auto' }}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;

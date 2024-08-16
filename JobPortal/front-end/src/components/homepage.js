import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/homepage.css'; 

const Header = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); 
  };

  const handleSignupClick = () => {
    navigate('/signup'); 
  };

  const navItems = ['Home', 'About Us', 'Services', 'Contact Us'];

  return (
    <header className="header">
      <div className="logoContainer">
        <img src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`}  alt="TrabahaDoor logo" className="logoImage" />
        <span className="logoText">TrabahaDoor</span>
      </div>
      <nav className="navigation">
        {navItems.map((item, index) => (
          <a key={index} href="" className="navItem"> 
            {item}
          </a>
        ))}
      </nav>
      <div className="authContainer">
        <button className="loginButton" onClick={handleLoginClick}>Login</button>
        <button className="signupButton" onClick={handleSignupClick}>Sign Up</button>
      </div>
    </header>
  );
};

const HeroSection = () => {
  return (
    <section className="heroSection">
      <div className="contentColumn">
        <h1 className="heroTitle">
          OPENING <br />
          <span className="highlight">Opportunities</span> <br />
          <span className="lightText">for all</span>
        </h1>
        <div className="blueRectangle"> </div>
        <p className="heroDescription">
          Your Gateway to Career Opportunities! Opening doors to a brighter future with the Public Employment Service Office of San Jose, Batangas. Explore, Apply, Succeed!
        </p>
        <button className="ctaButton">GET STARTED</button>
      </div>
      <div className="imageColumn">
        <img src={`${process.env.PUBLIC_URL}/assets/jobfair.jpg`}  alt="homepage" className="homepageimage" />
      </div>
    </section>
  );
};


const Announcements = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
  
    const slides = [
        { src: "/assets/jobfair.jpg", alt: "First slide", caption: "Caption Text" },
        { src: "/assets/jobfair.jpg", alt: "Second slide", caption: "Caption Two" },
        { src: "/assets/jobfair.jpg", alt: "Third slide", caption: "Caption Three" }
    ];
    const goToNextSlide = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    };
  
    const goToPreviousSlide = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? slides.length - 1 : prevIndex - 1
      );
    };
  
    const goToSlide = (index) => {
      setCurrentIndex(index);
    };
  
    return (
      <section className="announcementsSection">
        <h2 className="announcementsTitle">ANNOUNCEMENTS</h2>
        <hr className="separator" /> 
        <div className="slideshow-container">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`mySlides fade ${index === currentIndex ? 'active' : ''}`}
            >
              <div className="numbertext">{index + 1} / {slides.length}</div>
              <img src={slide.src} alt={slide.alt} style={{ width: "100%" }} />
              <div className="text">{slide.caption}</div>
            </div>
          ))}
          <a className="prev" onClick={goToPreviousSlide}>&#10094;</a>
          <a className="next" onClick={goToNextSlide}>&#10095;</a>
        </div>
        <br />
        <div style={{ textAlign: "center" }}>
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            ></span>
          ))}
        </div>
      </section>
    );
  };

const LandingPage = () => {
  return (
    <main className="landingPage">
      <Header />
      <HeroSection />
      <Announcements />
    </main>
  );
};

export default LandingPage;

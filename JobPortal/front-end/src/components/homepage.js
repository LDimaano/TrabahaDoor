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


const ServiceCard = ({ icon, title, description }) => {
  return (
    <article className="serviceCard">
      <div className="iconWrapper">
        <img src={icon} alt="" className="icon" />
      </div>
      <h3 className="services-title">{title}</h3>
      <p className="services-description">{description}</p>
    </article>
  );
};

const services = [
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/d7265688ee7776c5a340d1164837f583a5b173148048ade774afb3b45e6ca3b7?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975",
    title: "JOB MATCHING",
    description: "Matching job seekers with available job vacancies."
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/aaf90004eb0f3484461feb54bd2ba2745d5b972e13c19cd22a246859ba671dc0?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975",
    title: "CAREER GUIDANCE",
    description: "Assisting individuals in making informed decisions about their careers."
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/4bc63f0aae35ba3109731d4bb1cc09b251978c856b036c2e0c2128170190f9b3?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975",
    title: "SKILLS TRAINING",
    description: "Providing or coordinating skills training programs to improve the employability of job seekers."
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/3010d0775b43daf31c3a2e6366996039cb8c87287b054a40d1d43211752cec05?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975",
    title: "JOB FAIRS",
    description: "Organizing events to connect job seekers with employers."
  }
];

const OurServices = () => {
  return (
    <section className="ourServices">
      <h2 className="heading">OUR SERVICES</h2>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/c4eaa54b4d997d60d4d77402c2f9614ebecc4b31c19a9d99a735585aefb5c34d?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
        alt=""
        className="decorativeImage"
      />
      <div className="serviceGrid">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            icon={service.icon}
            title={service.title}
            description={service.description}
          />
        ))}
      </div>
    </section>
  );
};

const AboutUs = () => {
  return (
    <section className="aboutContainer">
      <div className="image-column">
        <img 
          loading="lazy" 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/bc8ceb35ea27108f4f8c5a04de801c84eeec28ac0633cc84f8307834cd82482c?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
          className="aboutImage" 
          alt="PESO San Jose office or team members"
        />
      </div>
      <div className="content-column">
        <div className="content-wrapper">
          <div className="text-content">
            <h2 className="aboutTitle">
              About Us <br />
              <span style={{ fontWeight: 500 }}>PESO San Jose</span>
            </h2>
            <p className="aboutDescription">
              The Public Employment Service Office (PESO) of San Jose, Batangas, is a vital government agency dedicated to assisting job seekers, including students, indigents, and persons with disabilities (PWDs), in finding employment opportunities.
            </p>
            <p className="aboutServices">
              PESO San Jose Batangas provides various services such as job fairs, skills training, and career counseling, aiming to enhance the employability of the local workforce and support economic development in the community.
            </p>
          </div>
          <button className="exploreButton">Explore More</button>
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  return (
    <section className="contactSection">
      <div className="contactInfo">
        <h2 className="contactSubtitle">Wanna hear more?</h2>
        <h1 className="contactTitle">CONTACT US</h1>
        <p className="contactDescription">
          For more inquiries, visit us in our office. We would love to hear from you!
        </p>
      </div>
      <div className="mapContainer">
        <a href="#" className="mapLink">View Larger Map</a>
        <div className="mapWrapper">
          <img 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/aa50eba43461c1c3d54804e644900566e5261a9d90ac8429ea790ba0a11abb10?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
            alt="Map showing the location of our office" 
            className="mapImage" 
          />
          <div className="locationLabel">
            <span className="locationCity">San Jose</span>
            <br />
            <span className="locationState">Batangas</span>
          </div>
        </div>
      </div>
    </section>
  );
};
const Footer = () => {
  const aboutItems = ['Services', 'About Us', 'Contact'];
  const resourceItems = ['Facebook'];

  const FooterColumn = ({ title, items }) => {
    return (
      <div className="footerColumn">
        <h2 className="columnTitle">{title}</h2>
        <ul className="columnList">
          {items.map((item, index) => (
            <li key={index} className="columnItem">{item}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <footer className="footer">
      <div className="footerContent">
        <div className="f-logoSection">
          <div className="f-logoWrapper">
            <img 
              loading="lazy" 
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/9a041a0749592ac4adcd0d49d215ec305d8ef2b8bfa04e2e12bc81be88b68fe4?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
              className="logo" 
              alt="TrabahaDoor logo" 
            />
            <div className="brandName">TrabahaDoor</div>
          </div>
          <p className="f-description">
            Great platform for the job seeker that passionate about startups. Find your dream job easier.
          </p>
        </div>
        <FooterColumn title="About" items={aboutItems} />
        <FooterColumn title="Resources" items={resourceItems} />
      </div>
      <img 
        loading="lazy" 
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/952d6d8de5a60a59be33590795d23544dcb9a79cdebfef402ce60593d73463c2?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
        className="divider" 
        alt="" 
      />
      <p className="copyright">
        2021 @ Trabahadoor. All rights reserved.
      </p>
    </footer>
  );
};

const LandingPage = () => {
  return (
    <main className="landingPage">
      <Header />
      <HeroSection />
      <Announcements />
      <OurServices/>
      <AboutUs/>
      <ContactSection/>
      <Footer/>
    </main>
  );
};

export default LandingPage;

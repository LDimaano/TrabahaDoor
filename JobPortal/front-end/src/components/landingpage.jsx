import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <header className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand" href="#">
          <img src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`} alt="TrabahaDoor logo" width="30" height="30" className="d-inline-block align-top" />
          TrabahaDoor
        </a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {navItems.map((item, index) => (
              <li key={index} className="nav-item">
                <a className="nav-link" href={`#${item.toLowerCase().replace(' ', '-')}`}>{item}</a>
              </li>
            ))}
          </ul>
          <div className="d-flex">
            <button className="btn btn-outline-primary me-2" onClick={handleLoginClick}>Login</button>
            <button className="btn btn-primary" onClick={handleSignupClick}>Sign Up</button>
          </div>
        </div>
      </div>
    </header>
  );
};

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

const Announcements = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    { src: "/assets/jobfair.jpg", alt: "First slide", caption: "PESO SAN JOSE" },
    { src: "/assets/Peso1.jpg", alt: "Second slide", caption: "PESO SAN JOSE" },
    { src: "/assets/Peso2.jpg", alt: "Third slide", caption: "PESO SAN JOSE" },
    { src: "/assets/Peso3.jpg", alt: "Fifth slide", caption: "PESO SAN JOSE" },
    { src: "/assets/Peso4.jpg", alt: "Sixth slide", caption: "PESO SAN JOSE" }
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

  return (
    <section className="py-5">
      <div className="container text-center">
        <h2 className="mb-4">ANNOUNCEMENTS</h2>
        <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {slides.map((slide, index) => (
              <div key={index} className={`carousel-item ${index === currentIndex ? 'active' : ''}`}>
                <div className="d-flex justify-content-center">
                  <img 
                    src={slide.src} 
                    className="d-block" 
                    alt={slide.alt} 
                    style={{ maxWidth: '700px', height: 'auto' }} 
                  />
                </div>
                <div className="carousel-caption d-none d-md-block">
                  <h5>{slide.caption}</h5>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" onClick={goToPreviousSlide}>
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>
          <button className="carousel-control-next" type="button" onClick={goToNextSlide}>
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </section>
  );
};
const ServiceCard = ({ icon, title, description }) => {
  return (
    <div className="col-lg-3 col-md-6 mb-4">
      <div className="card h-100 text-center">
        <img src={icon} alt="" className="card-img-top" />
        <div className="card-body">
          <h4 className="card-title">{title}</h4>
          <p className="card-text">{description}</p>
        </div>
      </div>
    </div>
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
    <section className="py-5 bg-light">
      <div className="container text-center">
        <h2 className="mb-4">OUR SERVICES</h2>
        <div className="row">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

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
            />
          </div>
          <div className="col-lg-6">
            <h2>About <strong>PESO San Jose</strong></h2>
            <p>The Public Employment Service Office (PESO) of San Jose, Batangas, is dedicated to assisting job seekers, including students, indigents, and persons with disabilities (PWDs), in finding employment opportunities.</p>
            <p>PESO San Jose Batangas offers job fairs, skills training, and career counseling, supporting the local workforce and economic development.</p>
            <button className="btn btn-primary">Explore More</button>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container text-center">
        <h2 className="mb-4">CONTACT US</h2>
        <p>Visit our office for more inquiries. We would love to hear from you!</p>
        <iframe
          src="https://www.google.com/maps?q=13.8693544,121.1062008&z=15&output=embed"
          className="w-100"
          height="400"
          allowFullScreen=""
          loading="lazy"
          title="Office Location"
        ></iframe>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4">
      <div className="container text-center">
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/9a041a0749592ac4adcd0d49d215ec305d8ef2b8bfa04e2e12bc81be88b68fe4?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" alt="TrabahaDoor logo" width="50" />
        <p className="mt-3">
          2021 @ Trabahadoor. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

const LandingPage = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Announcements />
      <OurServices />
      <AboutUs />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default LandingPage;

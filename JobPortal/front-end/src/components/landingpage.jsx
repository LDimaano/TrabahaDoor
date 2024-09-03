import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/landingpage.module.css'; 

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
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <img src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`} alt="TrabahaDoor logo" className={styles.logoImage} />
        <span className={styles.logoText}>TrabahaDoor</span>
      </div>
      <nav className={styles.navigation}>
        {navItems.map((item, index) => (
          <a key={index} href={`#${item.toLowerCase().replace(' ', '-')}`} className={styles.navItem}> 
            {item}
          </a>
        ))}
      </nav>
      <div className={styles.authContainer}>
        <button className={styles.loginButton} onClick={handleLoginClick}>Login</button>
        <button className={styles.signupButton} onClick={handleSignupClick}>Sign Up</button>
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
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          OPENING <br />
          <span className={styles.highlight}>Opportunities</span> <br />
          <span className={styles.subHighlight}>for all</span>
        </h1>
        <p className={styles.heroDescription}>
          Your Gateway to Career Opportunities! Opening doors to a brighter future with the Public Employment Service Office of San Jose, Batangas. Explore, Apply, Succeed!
        </p>
        <button className={styles.ctaButton} onClick={handleButtonClick}>
          Get Started
        </button>
      </div>
      <div className={styles.heroImageWrapper}>
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/dd4529adb83c64e54d505e5c50c741ae2faae77894b272c18394f2ee1c7392ee?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" alt="People working together" className={styles.heroImage} />
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

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className={styles.announcementsSection}>
      <h2 className={styles.announcementsTitle}>ANNOUNCEMENTS</h2>
      <hr className={styles.separator} /> 
      <div className={styles.slideshowContainer}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`${styles.mySlides} ${styles.fade} ${index === currentIndex ? styles.active : ''}`}
          >
            <div className={styles.numberText}>{index + 1} / {slides.length}</div>
            <img src={slide.src} alt={slide.alt} className={styles.slideImage} />
            <div className={styles.text}>{slide.caption}</div>
          </div>
        ))}
        <a className={styles.prev} onClick={goToPreviousSlide}>&#10094;</a>
        <a className={styles.next} onClick={goToNextSlide}>&#10095;</a>
      </div>
      <div style={{ textAlign: "center" }}>
        {slides.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
      <hr className={styles.separator} />
    </section>
  );
};

const ServiceCard = ({ icon, title, description }) => {
  return (
    <article className={styles.serviceCard}>
      <div className={styles.iconWrapper}>
        <img src={icon} alt="" className={styles.icon} />
      </div>
      <h3 className={styles.servicesTitle}>{title}</h3>
      <p className={styles.servicesDescription}>{description}</p>
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
    <section className={styles.ourServices}>
      <h2 className={styles.heading}>OUR SERVICES</h2>
      <div className={styles.serviceGrid}>
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
    <section className={styles.aboutContainer}>
      <div className={styles.imageColumn}>
        <img 
          loading="lazy" 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/bc8ceb35ea27108f4f8c5a04de801c84eeec28ac0633cc84f8307834cd82482c?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
          className={styles.aboutImage} 
          alt="PESO San Jose office or team members"
        />
      </div>
      <div className={styles.contentColumn}>
        <div className={styles.contentWrapper}>
          <div className={styles.textContent}>
            <h2 className={styles.aboutTitle}>
              About<br />
              <span style={{ fontWeight: 500 }}>PESO San Jose</span>
            </h2>
            <p className={styles.aboutDescription}>
              The Public Employment Service Office (PESO) of San Jose, Batangas, is a vital government agency dedicated to assisting job seekers, including students, indigents, and persons with disabilities (PWDs), in finding employment opportunities.
            </p>
            <p className={styles.aboutServices}>
              PESO San Jose Batangas provides various services such as job fairs, skills training, and career counseling, aiming to enhance the employability of the local workforce and support economic development in the community.
            </p>
          </div>
          <button className={styles.exploreButton}>Explore More</button>
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  return (
    <section className={styles.contactSection}>
      <div className={styles.contactInfo}>
        <h2 className={styles.contactSubtitle}>Wanna hear more?</h2>
        <h1 className={styles.contactTitle}>CONTACT US</h1>
        <p className={styles.contactDescription}>
          For more inquiries, visit us in our office. We would love to hear from you!
        </p>
      </div>
      <div className={styles.mapContainer}>
        <a href="#" className={styles.mapLink}>View Larger Map</a>
        <div className={styles.mapWrapper}>
          <img 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/aa50eba43461c1c3d54804e644900566e5261a9d90ac8429ea790ba0a11abb10?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
            alt="Map showing the location of our office" 
            className={styles.mapImage} 
          />
          <div className={styles.locationLabel}>
            <span className={styles.locationCity}>San Jose</span>
            <br />
            <span className={styles.locationState}>Batangas</span>
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
      <div className={styles.footerColumn}>
        <h2 className={styles.columnTitle}>{title}</h2>
        <ul className={styles.columnList}>
          {items.map((item, index) => (
            <li key={index} className={styles.columnItem}>{item}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.logoSection}>
          <div className={styles.logoWrapper}>
            <img 
              loading="lazy" 
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/9a041a0749592ac4adcd0d49d215ec305d8ef2b8bfa04e2e12bc81be88b68fe4?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
              className={styles.logo} 
              alt="TrabahaDoor logo" 
            />
            <div className={styles.brandName}>TrabahaDoor</div>
          </div>
          <p className={styles.description}>
            Great platform for the job seeker that passionate about startups. Find your dream job easier.
          </p>
        </div>
        <FooterColumn title="About" items={aboutItems} />
        <FooterColumn title="Resources" items={resourceItems} />
      </div>
      <img 
        loading="lazy" 
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/952d6d8de5a60a59be33590795d23544dcb9a79cdebfef402ce60593d73463c2?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" 
        className={styles.divider} 
        alt="" 
      />
      <p className={styles.copyright}>
        2021 @ Trabahadoor. All rights reserved.
      </p>
    </footer>
  );
};

const LandingPage = () => {
  return (
    <main className={styles.landingPage}>
      <Header />
      <Hero/>
      <Announcements />
      <OurServices/>
      <AboutUs/>
      <ContactSection/>
      <Footer/>
    </main>
  );
};

export default LandingPage;

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/header';
import Hero from '../components/hero';
import Announcements from '../components/announcements';
import OurServices from '../components/ourservices';
import AboutUs from '../components/aboutus';
import ContactSection from '../components/contact';
import Footer from '../components/footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

const LandingPage = () => {
  const [showScroll, setShowScroll] = useState(false);

  // Handle scroll event to show or hide the button
  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div>
      <Helmet>
        <title>Trabahadoor</title>
      </Helmet>
      <Header />

      <section id="home" className="container-fluid p-0">
        <Hero />
      </section>
      
      <section id="PESO" className="container py-5">
        <Announcements />
      </section>
      
      <section id="services" className="container py-5">
        <OurServices />
      </section>
      
      <section id="about" className="container py-5">
        <AboutUs />
      </section>
      
      <section id="contact" className="container py-5">
        <ContactSection />
      </section>

      <Footer />

      {/* Scroll-to-Top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '1000',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
          }}
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      )}
    </div>
  );
};

export default LandingPage;

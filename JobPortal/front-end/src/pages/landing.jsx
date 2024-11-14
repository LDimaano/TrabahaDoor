import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/header';
import Hero from '../components/hero';
import Announcements from '../components/announcements';
import OurServices from '../components/ourservices';
import AboutUs from '../components/aboutus';
import ContactSection from '../components/contact';
import Footer from '../components/footer';


const LandingPage = () => {
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
    </div>
  );
};

export default LandingPage;

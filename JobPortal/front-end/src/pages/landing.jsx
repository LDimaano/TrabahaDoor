import React from 'react';

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

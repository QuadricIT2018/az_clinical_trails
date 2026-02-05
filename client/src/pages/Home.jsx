import React from 'react';
import Hero from '../components/Hero/Hero';
import About from '../components/About/About';
import ResearchAreas from '../components/ResearchAreas/ResearchAreas';
import WhyParticipate from '../components/WhyParticipate/WhyParticipate';
import CallToAction from '../components/CallToAction/CallToAction';
import Footer from '../components/Footer/Footer';

const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <ResearchAreas />
      <WhyParticipate />
      <CallToAction />
      <Footer />
    </>
  );
};

export default Home;

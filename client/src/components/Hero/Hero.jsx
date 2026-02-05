import React from 'react';
import { Link } from 'react-router-dom';
import { FaMicroscope, FaUserPlus, FaExternalLinkAlt, FaDna } from 'react-icons/fa';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero__container">
        <div className="hero__content">
          <h1 className="hero__title">
            <FaMicroscope className="hero__title-icon" />
            <span>Advancing Medical Research</span>
          </h1>
          <p className="hero__subtitle">
            Join AstraZeneca's cutting-edge clinical trials and help develop tomorrow's life-saving treatments. Your<br />
            participation can make a difference in the lives of millions.
          </p>
          <div className="hero__buttons">
            <Link to="/register" className="hero__btn hero__btn--primary">
              <FaUserPlus className="hero__btn-icon hero__btn-icon--primary" />
              <span>Register Your Interest</span>
            </Link>
            <a
              href="https://www.astrazenecaclinicaltrials.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hero__btn hero__btn--secondary"
            >
              <FaExternalLinkAlt className="hero__btn-icon hero__btn-icon--secondary" />
              <span>Learn More</span>
            </a>
          </div>
        </div>
        <div className="hero__decoration">
          <FaDna className="hero__dna-icon" />
        </div>
      </div>
    </section>
  );
};

export default Hero;

import React from 'react';
import { Link } from 'react-router-dom';
import { FaMicroscope, FaUserPlus, FaExternalLinkAlt, FaDna, FaCrosshairs, FaUserMd } from 'react-icons/fa';
import Footer from '../components/Footer/Footer';
import './CellTherapy.css';

const CellTherapy = () => {
  const features = [
    {
      icon: <FaDna />,
      title: 'CAR-T Technology',
      description: 'Chimeric Antigen Receptor T-cell therapy uses genetically modified T-cells to recognize and attack cancer cells, offering new hope for patients with certain blood cancers.'
    },
    {
      icon: <FaCrosshairs />,
      title: 'Targeted Treatment',
      description: 'Our cell therapies are designed to precisely target cancer cells while minimizing damage to healthy tissue, potentially reducing side effects compared to traditional treatments.'
    },
    {
      icon: <FaUserMd />,
      title: 'Personalized Care',
      description: 'Each treatment is tailored to the individual patient, using their own cells to create a personalized therapy that works with their unique immune system.'
    }
  ];

  return (
    <>
      <div className="cell-therapy">
        {/* Hero Section */}
        <section className="cell-therapy__hero">
          <div className="container">
            <div className="cell-therapy__hero-content">
              <div className="cell-therapy__hero-text">
                <h1 className="cell-therapy__hero-title">
                  <FaMicroscope className="cell-therapy__hero-title-icon" />
                  <span>Cell Therapy</span>
                </h1>
                <p className="cell-therapy__hero-subtitle">
                  Pioneering the future of cancer treatment through advanced cellular therapies and CAR-T technology.
                </p>
                <div className="cell-therapy__hero-buttons">
                  <Link to="/register" className="cell-therapy__btn cell-therapy__btn--primary">
                    <FaUserPlus className="cell-therapy__btn-icon" />
                    <span>Express Interest</span>
                  </Link>
                  <a
                    href="https://www.astrazenecaclinicaltrials.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cell-therapy__btn cell-therapy__btn--secondary"
                  >
                    <FaExternalLinkAlt className="cell-therapy__btn-icon" />
                    <span>Learn More</span>
                  </a>
                </div>
              </div>
              <div className="cell-therapy__hero-visual">
                <FaDna className="cell-therapy__hero-dna" />
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="cell-therapy__content">
          <div className="container">
            <h2 className="cell-therapy__content-title">Innovative Clinical Research</h2>
            <p className="cell-therapy__content-subtitle">
              Our cell therapy programs are at the forefront of medical innovation, developing treatments that harness the power of the immune system.
            </p>

            <div className="cell-therapy__features">
              {features.map((feature, index) => (
                <div key={index} className="cell-therapy__feature-card">
                  <div className="cell-therapy__feature-icon">
                    {feature.icon}
                  </div>
                  <h3 className="cell-therapy__feature-title">{feature.title}</h3>
                  <p className="cell-therapy__feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default CellTherapy;

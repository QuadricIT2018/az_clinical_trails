import React from 'react';
import './Footer.css';

const Footer = () => {
  const resources = [
    { title: 'ClinicalTrials.gov', url: 'https://clinicaltrials.gov' },
    { title: 'AstraZeneca Clinical Trials', url: 'https://www.astrazenecaclinicaltrials.com' },
    { title: 'Patient Safety', url: '#' },
    { title: 'Contact Us', url: '#' }
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__brand">
            <h3 className="footer__logo">AstraZeneca Clinical Trials</h3>
            <p className="footer__tagline">
              Advancing medical research for better patient outcomes worldwide.
            </p>
          </div>

          <div className="footer__resources">
            <h4 className="footer__resources-title">Resources</h4>
            <ul className="footer__resources-list">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a
                    href={resource.url}
                    target={resource.url.startsWith('http') ? '_blank' : '_self'}
                    rel={resource.url.startsWith('http') ? 'noopener noreferrer' : ''}
                    className="footer__link"
                  >
                    {resource.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {currentYear} AstraZeneca. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

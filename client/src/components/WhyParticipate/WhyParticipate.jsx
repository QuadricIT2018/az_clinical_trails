import React from 'react';
import { FaCheckCircle, FaInfoCircle, FaExternalLinkAlt } from 'react-icons/fa';
import './WhyParticipate.css';

const WhyParticipate = () => {
  const benefits = [
    { bold: 'Access to new treatments', regular: ' before they become widely available' },
    { bold: 'Expert medical care', regular: ' from leading healthcare professionals' },
    { bold: 'Contribute to medical advancement', regular: ' and help future patients' },
    { bold: 'Regular health monitoring', regular: ' throughout the study period' },
    { bold: 'No cost', regular: ' for study-related medical care and procedures' }
  ];

  const resources = [
    {
      title: 'ClinicalTrials.gov',
      url: 'https://clinicaltrials.gov'
    },
    {
      title: 'AstraZeneca Clinical Trials Portal',
      url: 'https://www.astrazenecaclinicaltrials.com'
    }
  ];

  return (
    <section className="why-participate section">
      <div className="container">
        <div className="why-participate__content">
          <div className="why-participate__left">
            <h2 className="why-participate__title">Why Participate in Clinical Trials?</h2>
            <ul className="why-participate__list">
              {benefits.map((benefit, index) => (
                <li key={index} className="why-participate__item">
                  <FaCheckCircle className="why-participate__check-icon" />
                  <span>
                    <strong>{benefit.bold}</strong>{benefit.regular}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="why-participate__right">
            <div className="why-participate__info-box">
              <div className="why-participate__info-header">
                <FaInfoCircle className="why-participate__info-icon" />
                <h3>Learn More About Clinical Trials</h3>
              </div>
              <p className="why-participate__info-text">
                For comprehensive information about clinical trials, their phases, and what to expect,
                visit these authoritative resources:
              </p>
              <div className="why-participate__links">
                {resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="why-participate__link"
                  >
                    <FaExternalLinkAlt className="why-participate__link-icon" />
                    <span>{resource.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyParticipate;

import React from 'react';
import { Link } from 'react-router-dom';
import { GiDna2, GiLungs } from 'react-icons/gi';
import { FaRibbon, FaTint } from 'react-icons/fa';
import './ResearchAreas.css';

const ResearchAreas = () => {
  const areas = [
    {
      icon: <GiDna2 />,
      title: 'Cell Therapy',
      description: 'CAR-T and advanced cellular therapies for cancer treatment',
      link: '/clinical-trials',
      isInternal: true
    },
    {
      icon: <GiLungs />,
      title: 'Respiratory',
      description: 'Asthma, COPD, and other breathing disorders',
      link: null,
      isInternal: false
    },
    {
      icon: <FaRibbon />,
      title: 'Oncology',
      description: 'Cancer treatment and immunotherapy research',
      link: null,
      isInternal: false
    },
    {
      icon: <FaTint />,
      title: 'Diabetes',
      description: 'Type 1 and Type 2 diabetes management',
      link: null,
      isInternal: false
    }
  ];

  return (
    <section className="research-areas section">
      <div className="container">
        <h2 className="section-title">Our Research Areas</h2>
        <p className="section-subtitle">
          We focus on therapeutic areas where we can make the biggest difference for patients worldwide.
        </p>

        <div className="research-areas__grid">
          {areas.map((area, index) => (
            area.isInternal && area.link ? (
              <Link key={index} to={area.link} className="research-areas__card research-areas__card--clickable">
                <div className="research-areas__card-icon">
                  {area.icon}
                </div>
                <h3 className="research-areas__card-title">{area.title}</h3>
                <p className="research-areas__card-description">{area.description}</p>
              </Link>
            ) : (
              <div key={index} className="research-areas__card">
                <div className="research-areas__card-icon">
                  {area.icon}
                </div>
                <h3 className="research-areas__card-title">{area.title}</h3>
                <p className="research-areas__card-description">{area.description}</p>
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResearchAreas;

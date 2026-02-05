import React from 'react';
import { FaGlobeAmericas, FaUsers, FaFlask } from 'react-icons/fa';
import './About.css';

const About = () => {
  const features = [
    {
      icon: <FaGlobeAmericas />,
      title: 'Global Research',
      description: 'Conducting research across multiple countries and therapeutic areas to address the world\'s most pressing health challenges.',
      iconBg: 'burgundy'
    },
    {
      icon: <FaUsers />,
      title: 'Patient-Centered',
      description: 'Putting patients at the center of everything we do, ensuring their safety and well-being throughout the research process.',
      iconBg: 'gold'
    },
    {
      icon: <FaFlask />,
      title: 'Innovation',
      description: 'Developing breakthrough treatments using cutting-edge science and technology to improve patient outcomes.',
      iconBg: 'burgundy'
    }
  ];

  return (
    <section id="about" className="about section">
      <div className="container">
        <h2 className="section-title">About AstraZeneca Clinical Trials</h2>
        <p className="section-subtitle">
          AstraZeneca is a global biopharmaceutical company committed to advancing medical
          science through innovative clinical research and development programs.
        </p>

        <div className="about__cards">
          {features.map((feature, index) => (
            <div key={index} className="about__card">
              <div className={`about__card-icon about__card-icon--${feature.iconBg}`}>
                {feature.icon}
              </div>
              <h3 className="about__card-title">{feature.title}</h3>
              <p className="about__card-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;

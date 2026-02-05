import React from 'react';
import { Link } from 'react-router-dom';
import { FaClipboardList } from 'react-icons/fa';
import './CallToAction.css';

const CallToAction = () => {
  return (
    <section className="cta">
      <div className="container">
        <div className="cta__content">
          <h2 className="cta__title">Ready to Make a Difference?</h2>
          <p className="cta__description">
            Join thousands of participants who are helping advance medical research.
            Your participation could help develop treatments that save lives.
          </p>
          <Link to="/register" className="cta__button">
            <FaClipboardList className="cta__button-icon" />
            <span>Register Your Interest Today</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;

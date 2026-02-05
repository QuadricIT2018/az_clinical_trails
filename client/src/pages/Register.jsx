import React, { useState } from 'react';
import {
  FaUserPlus,
  FaCheckCircle,
  FaExclamationCircle,
  FaUser,
  FaBirthdayCake,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaMedkit,
  FaClipboardList,
  FaQuestionCircle,
  FaInfoCircle,
  FaCheck,
  FaExternalLinkAlt
} from 'react-icons/fa';
import { registrationsAPI } from '../services/api';
import Footer from '../components/Footer/Footer';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    email: '',
    phone: '',
    zipCode: '',
    healthInfo: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (parseInt(formData.age) < 18) {
      newErrors.age = 'You must be 18 years or older to participate';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }

    if (!formData.healthInfo.trim()) {
      newErrors.healthInfo = 'Health information is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await registrationsAPI.create({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        age: parseInt(formData.age),
        zipCode: formData.zipCode,
        healthInfo: formData.healthInfo,
        consent: true
      });
      setSubmitStatus('success');
      setFormData({
        fullName: '',
        age: '',
        email: '',
        phone: '',
        zipCode: '',
        healthInfo: ''
      });
    } catch (error) {
      setSubmitStatus('error');
      if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({ submit: 'An error occurred. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextSteps = [
    'We review your information',
    'Match you with suitable trials',
    'Contact you within 5-7 days',
    'Schedule screening if interested'
  ];

  return (
    <>
      <div className="register">
        <div className="container">
          <div className="register__header">
            <h1 className="register__title">
              <FaUserPlus className="register__title-icon" />
              <span>Register Your Interest</span>
            </h1>
            <p className="register__subtitle">
              Complete this form to express your interest in participating in AstraZeneca clinical trials. We'll review
              your information and contact you about suitable opportunities.
            </p>
          </div>

          {submitStatus === 'success' && (
            <div className="register__alert register__alert--success">
              <FaCheckCircle />
              <div>
                <strong>Registration Successful!</strong>
                <p>Thank you for your interest in our clinical trials. We will contact you soon with more information.</p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && errors.submit && (
            <div className="register__alert register__alert--error">
              <FaExclamationCircle />
              <div>
                <strong>Registration Failed</strong>
                <p>{errors.submit}</p>
              </div>
            </div>
          )}

          <div className="register__form-container">
            <div className="register__form-header">
              <FaClipboardList className="register__form-header-icon" />
              <span>Clinical Trial Interest Form</span>
            </div>

            <form className="register__form" onSubmit={handleSubmit}>
              <div className="register__form-grid">
                <div className="register__field">
                  <label htmlFor="fullName" className="register__label">
                    <FaUser className="register__label-icon" />
                    Full Name <span className="register__required">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`register__input ${errors.fullName ? 'register__input--error' : ''}`}
                  />
                  {errors.fullName && <span className="register__error">{errors.fullName}</span>}
                </div>

                <div className="register__field">
                  <label htmlFor="age" className="register__label">
                    <FaBirthdayCake className="register__label-icon" />
                    Age <span className="register__required">*</span>
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="0"
                    className={`register__input ${errors.age ? 'register__input--error' : ''}`}
                  />
                  <span className="register__helper">Must be 18 years or older to participate</span>
                  {errors.age && <span className="register__error">{errors.age}</span>}
                </div>

                <div className="register__field">
                  <label htmlFor="email" className="register__label">
                    <FaEnvelope className="register__label-icon" />
                    Email Address <span className="register__required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`register__input ${errors.email ? 'register__input--error' : ''}`}
                  />
                  {errors.email && <span className="register__error">{errors.email}</span>}
                </div>

                <div className="register__field">
                  <label htmlFor="phone" className="register__label">
                    <FaPhone className="register__label-icon register__label-icon--phone" />
                    Mobile Number <span className="register__required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`register__input ${errors.phone ? 'register__input--error' : ''}`}
                  />
                  <span className="register__helper">10-digit phone number</span>
                  {errors.phone && <span className="register__error">{errors.phone}</span>}
                </div>

                <div className="register__field register__field--full">
                  <label htmlFor="zipCode" className="register__label">
                    <FaMapMarkerAlt className="register__label-icon" />
                    ZIP Code <span className="register__required">*</span>
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={`register__input ${errors.zipCode ? 'register__input--error' : ''}`}
                  />
                  <span className="register__helper">This helps us identify clinical trials in your area</span>
                  {errors.zipCode && <span className="register__error">{errors.zipCode}</span>}
                </div>

                <div className="register__field register__field--full">
                  <label htmlFor="healthInfo" className="register__label">
                    <FaMedkit className="register__label-icon" />
                    Brief Health Information <span className="register__required">*</span>
                  </label>
                  <textarea
                    id="healthInfo"
                    name="healthInfo"
                    value={formData.healthInfo}
                    onChange={handleChange}
                    className={`register__textarea ${errors.healthInfo ? 'register__input--error' : ''}`}
                    placeholder="Please describe your current health status, any medical conditions, medications, or relevant health information..."
                    rows="4"
                  />
                  <span className="register__helper">
                    Please provide information about any medical conditions, medications you're taking, allergies, or other relevant health details.
                  </span>
                  {errors.healthInfo && <span className="register__error">{errors.healthInfo}</span>}
                </div>
              </div>

              <button
                type="submit"
                className="register__submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Interest'}
              </button>
            </form>
          </div>

          <div className="register__info-boxes">
            <div className="register__info-box register__info-box--gold">
              <div className="register__info-box-header">
                <FaQuestionCircle className="register__info-box-icon" />
                <h3>What Happens Next?</h3>
              </div>
              <ul className="register__info-box-list">
                {nextSteps.map((step, index) => (
                  <li key={index}>
                    <FaCheck className="register__info-box-check" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="register__info-box register__info-box--burgundy">
              <div className="register__info-box-header">
                <FaInfoCircle className="register__info-box-icon" />
                <h3>Need More Information?</h3>
              </div>
              <p className="register__info-box-text">
                Learn more about clinical trials and what to expect:
              </p>
              <div className="register__info-box-buttons">
                <a
                  href="https://clinicaltrials.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="register__info-box-btn"
                >
                  ClinicalTrials.gov
                </a>
                <a
                  href="https://www.astrazenecaclinicaltrials.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="register__info-box-btn"
                >
                  AstraZeneca Portal
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;

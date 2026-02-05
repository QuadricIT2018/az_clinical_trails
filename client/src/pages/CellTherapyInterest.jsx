import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FaDna,
  FaInfoCircle,
  FaShieldAlt,
  FaQuestionCircle,
  FaClock,
  FaArrowLeft,
  FaSpinner
} from 'react-icons/fa';
import { cellTherapyAPI } from '../services/api';
import Footer from '../components/Footer/Footer';
import './CellTherapyInterest.css';

const CellTherapyInterest = () => {
  const { nctId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    zipCode: '',
    age: '',
    currentDiagnosis: '',
    currentHealthStatus: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Mobile Number validation (10 digits)
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit phone number';
    }

    // ZIP Code validation (5 digits)
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid 5-digit ZIP code';
    }

    // Age validation (must be 18 or older)
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (parseInt(formData.age) < 18) {
      newErrors.age = 'You must be 18 or older to participate';
    } else if (parseInt(formData.age) > 120) {
      newErrors.age = 'Please enter a valid age';
    }

    // Current Diagnosis validation
    if (!formData.currentDiagnosis.trim()) {
      newErrors.currentDiagnosis = 'Current diagnosis is required';
    }

    // Current Health Status validation
    if (!formData.currentHealthStatus.trim()) {
      newErrors.currentHealthStatus = 'Current health status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const submissionData = {
        ...formData,
        mobileNumber: formData.mobileNumber.replace(/\D/g, ''),
        age: parseInt(formData.age),
        trialNctId: nctId || null,
        formType: 'Cell Therapy Interest',
        submittedAt: new Date().toISOString()
      };

      await cellTherapyAPI.create(submissionData);

      setSubmitSuccess(true);
    } catch (err) {
      console.error('Error submitting form:', err);
      setSubmitError(
        err.response?.data?.message ||
        'There was an error submitting your form. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackClick = () => {
    navigate('/clinical-trials');
  };

  if (submitSuccess) {
    return (
      <>
        <div className="cell-therapy-interest">
          <div className="container">
            <div className="cell-therapy-interest__success">
              <div className="cell-therapy-interest__success-icon">
                <FaDna />
              </div>
              <h2 className="cell-therapy-interest__success-title">Thank You!</h2>
              <p className="cell-therapy-interest__success-message">
                Thank you for your interest! Our team will review your information and contact you within <strong>3-5 business days</strong>.
              </p>
              <div className="cell-therapy-interest__success-buttons">
                <Link to="/" className="cell-therapy-interest__success-btn cell-therapy-interest__success-btn--primary">
                  Return to Home
                </Link>
                {nctId && (
                  <Link to={`/trial/${nctId}`} className="cell-therapy-interest__success-btn cell-therapy-interest__success-btn--secondary">
                    Back to Trial Details
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="cell-therapy-interest">
        <div className="container">
          {/* Page Header */}
          <div className="cell-therapy-interest__header">
            <h1 className="cell-therapy-interest__title">
              <FaDna className="cell-therapy-interest__title-icon" />
              <span>Cell Therapy Interest Form</span>
            </h1>
            <p className="cell-therapy-interest__subtitle">
              Express your interest in AstraZeneca's innovative cell therapy clinical trials
            </p>
          </div>

          {/* Form Container */}
          <div className="cell-therapy-interest__form-container">
            <form onSubmit={handleSubmit} className="cell-therapy-interest__form">
              {/* Section 1: Before You Begin */}
              <div className="cell-therapy-interest__section">
                <div className="cell-therapy-interest__section-header">
                  <div className="cell-therapy-interest__section-icon cell-therapy-interest__section-icon--info">
                    <FaInfoCircle />
                  </div>
                  <h2 className="cell-therapy-interest__section-title">Before You Begin</h2>
                </div>
                <p className="cell-therapy-interest__section-description">
                  This form helps us determine if you might be eligible for our cell therapy trials. Please provide accurate information. All information is confidential and secure.
                </p>

                {/* Row 1: Full Name, Email */}
                <div className="cell-therapy-interest__row cell-therapy-interest__row--two-cols">
                  <div className="cell-therapy-interest__field">
                    <label htmlFor="fullName" className="cell-therapy-interest__label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`cell-therapy-interest__input ${errors.fullName ? 'cell-therapy-interest__input--error' : ''}`}
                    />
                    {errors.fullName && (
                      <span className="cell-therapy-interest__error">{errors.fullName}</span>
                    )}
                  </div>

                  <div className="cell-therapy-interest__field">
                    <label htmlFor="email" className="cell-therapy-interest__label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`cell-therapy-interest__input ${errors.email ? 'cell-therapy-interest__input--error' : ''}`}
                    />
                    {errors.email && (
                      <span className="cell-therapy-interest__error">{errors.email}</span>
                    )}
                  </div>
                </div>

                {/* Row 2: Mobile, ZIP Code, Age */}
                <div className="cell-therapy-interest__row cell-therapy-interest__row--three-cols">
                  <div className="cell-therapy-interest__field">
                    <label htmlFor="mobileNumber" className="cell-therapy-interest__label">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      id="mobileNumber"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      className={`cell-therapy-interest__input ${errors.mobileNumber ? 'cell-therapy-interest__input--error' : ''}`}
                    />
                    <span className="cell-therapy-interest__helper">
                      10-digit phone number (e.g., 5551234567)
                    </span>
                    {errors.mobileNumber && (
                      <span className="cell-therapy-interest__error">{errors.mobileNumber}</span>
                    )}
                  </div>

                  <div className="cell-therapy-interest__field">
                    <label htmlFor="zipCode" className="cell-therapy-interest__label">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      maxLength={5}
                      className={`cell-therapy-interest__input ${errors.zipCode ? 'cell-therapy-interest__input--error' : ''}`}
                    />
                    <span className="cell-therapy-interest__helper">5-digit ZIP code</span>
                    {errors.zipCode && (
                      <span className="cell-therapy-interest__error">{errors.zipCode}</span>
                    )}
                  </div>

                  <div className="cell-therapy-interest__field">
                    <label htmlFor="age" className="cell-therapy-interest__label">
                      Age
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      min={18}
                      max={120}
                      className={`cell-therapy-interest__input ${errors.age ? 'cell-therapy-interest__input--error' : ''}`}
                    />
                    <span className="cell-therapy-interest__helper">Age in years</span>
                    {errors.age && (
                      <span className="cell-therapy-interest__error">{errors.age}</span>
                    )}
                  </div>
                </div>

                {/* Row 3: Current Diagnosis */}
                <div className="cell-therapy-interest__row">
                  <div className="cell-therapy-interest__field">
                    <label htmlFor="currentDiagnosis" className="cell-therapy-interest__label">
                      Current Diagnosis
                    </label>
                    <input
                      type="text"
                      id="currentDiagnosis"
                      name="currentDiagnosis"
                      value={formData.currentDiagnosis}
                      onChange={handleInputChange}
                      className={`cell-therapy-interest__input ${errors.currentDiagnosis ? 'cell-therapy-interest__input--error' : ''}`}
                      placeholder="e.g., Hepatocellular Carcinoma, Advanced Liver Cancer, etc."
                    />
                    <span className="cell-therapy-interest__helper">
                      Current medical diagnosis (particularly liver-related conditions)
                    </span>
                    {errors.currentDiagnosis && (
                      <span className="cell-therapy-interest__error">{errors.currentDiagnosis}</span>
                    )}
                  </div>
                </div>

                {/* Row 4: Current Health Status */}
                <div className="cell-therapy-interest__row">
                  <div className="cell-therapy-interest__field">
                    <label htmlFor="currentHealthStatus" className="cell-therapy-interest__label">
                      Current Health Status
                    </label>
                    <textarea
                      id="currentHealthStatus"
                      name="currentHealthStatus"
                      value={formData.currentHealthStatus}
                      onChange={handleInputChange}
                      rows={5}
                      className={`cell-therapy-interest__textarea ${errors.currentHealthStatus ? 'cell-therapy-interest__textarea--error' : ''}`}
                      placeholder="Please describe your current health status, any treatments you've received, current medications, and any relevant medical history..."
                    />
                    <span className="cell-therapy-interest__helper">
                      Detailed information about your current health, treatments received, medications, and any relevant medical history that might be important for cell therapy evaluation.
                    </span>
                    {errors.currentHealthStatus && (
                      <span className="cell-therapy-interest__error">{errors.currentHealthStatus}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Privacy & Next Steps */}
              <div className="cell-therapy-interest__section">
                <div className="cell-therapy-interest__section-header">
                  <div className="cell-therapy-interest__section-icon cell-therapy-interest__section-icon--shield">
                    <FaShieldAlt />
                  </div>
                  <h2 className="cell-therapy-interest__section-title">Privacy & Next Steps</h2>
                </div>

                <ul className="cell-therapy-interest__privacy-list">
                  <li>Your information is confidential and will only be used for trial screening</li>
                  <li>A member of our research team will contact you if you may be eligible</li>
                  <li>Additional medical evaluations will be required for final eligibility determination</li>
                  <li>You may withdraw your interest at any time</li>
                </ul>
              </div>

              {/* Submit Error Message */}
              {submitError && (
                <div className="cell-therapy-interest__submit-error">
                  {submitError}
                </div>
              )}

              {/* Form Buttons */}
              <div className="cell-therapy-interest__buttons">
                <button
                  type="submit"
                  className="cell-therapy-interest__btn cell-therapy-interest__btn--primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="cell-therapy-interest__btn-spinner" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Interest for Cell Therapy</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBackClick}
                  className="cell-therapy-interest__btn cell-therapy-interest__btn--secondary"
                >
                  <FaArrowLeft />
                  <span>Back to Cell Therapy Info</span>
                </button>
              </div>
            </form>

            {/* Info Boxes */}
            <div className="cell-therapy-interest__info-boxes">
              <div className="cell-therapy-interest__info-box">
                <div className="cell-therapy-interest__info-box-icon">
                  <FaQuestionCircle />
                </div>
                <h3 className="cell-therapy-interest__info-box-title">Questions?</h3>
                <p className="cell-therapy-interest__info-box-text">
                  Contact our clinical research team at 888-689-8273 or visit{' '}
                  <a
                    href="https://www.astrazenecaclinicaltrials.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cell-therapy-interest__info-box-link"
                  >
                    AstraZeneca Clinical Trials
                  </a>
                </p>
              </div>

              <div className="cell-therapy-interest__info-box">
                <div className="cell-therapy-interest__info-box-icon">
                  <FaClock />
                </div>
                <h3 className="cell-therapy-interest__info-box-title">Response Time</h3>
                <p className="cell-therapy-interest__info-box-text">
                  You can expect to hear from our team within <strong>3-5 business days</strong> if you meet the initial screening criteria.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CellTherapyInterest;

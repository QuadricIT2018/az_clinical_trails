import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaShieldAlt,
  FaArrowLeft,
  FaExclamationTriangle,
  FaTimes,
  FaInfoCircle
} from 'react-icons/fa';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [showTopAlert, setShowTopAlert] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  // Auto-dismiss top alert after 5 seconds
  useEffect(() => {
    if (showTopAlert) {
      const timer = setTimeout(() => {
        setShowTopAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showTopAlert]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (error) {
      setError(null);
      setShowTopAlert(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check credentials
    if (formData.username === 'admin' && formData.password === 'admin') {
      // Successful login
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminUsername', formData.username);
      navigate('/admin/dashboard');
    } else {
      // Failed login
      setError('Invalid username or password');
      setShowTopAlert(true);
      setFormData(prev => ({
        ...prev,
        password: ''
      }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="admin-login">
      {/* Top Alert */}
      {showTopAlert && (
        <div className="admin-login__top-alert">
          <FaExclamationTriangle className="admin-login__top-alert-icon" />
          <span>Invalid username or password</span>
          <button
            onClick={() => setShowTopAlert(false)}
            className="admin-login__top-alert-close"
          >
            <FaTimes />
          </button>
        </div>
      )}

      <div className="admin-login__container">
        {/* Login Card */}
        <div className="admin-login__card">
          {/* Card Header */}
          <div className="admin-login__card-header">
            <FaShieldAlt className="admin-login__card-header-icon" />
            <h1 className="admin-login__card-title">Admin Login</h1>
            <p className="admin-login__card-subtitle">Clinical Trials Management Portal</p>
          </div>

          {/* Card Body */}
          <div className="admin-login__card-body">
            {/* Inline Error */}
            {error && (
              <div className="admin-login__inline-error">
                <FaExclamationTriangle />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="admin-login__form">
              <div className="admin-login__field">
                <label htmlFor="username" className="admin-login__label">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter username"
                  className="admin-login__input"
                  autoComplete="username"
                />
              </div>

              <div className="admin-login__field">
                <label htmlFor="password" className="admin-login__label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter password"
                  className="admin-login__input"
                  autoComplete="current-password"
                />
              </div>

              <div className="admin-login__helper">
                <FaInfoCircle className="admin-login__helper-icon" />
                <span>Contact IT support if you've forgotten your credentials</span>
              </div>

              <button type="submit" className="admin-login__submit-btn">
                Login
              </button>
            </form>

            <Link to="/" className="admin-login__back-link">
              <FaArrowLeft />
              <span>Back to Homepage</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="admin-login__footer">
          AstraZeneca Clinical Trials Portal &copy; 2024
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

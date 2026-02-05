import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHeartbeat, FaHome, FaUserPlus, FaCog } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Check admin login status
  useEffect(() => {
    const checkAdminStatus = () => {
      const loggedIn = localStorage.getItem('adminLoggedIn') === 'true';
      setIsAdminLoggedIn(loggedIn);
    };

    checkAdminStatus();
    // Listen for storage changes (for multi-tab support)
    window.addEventListener('storage', checkAdminStatus);
    return () => window.removeEventListener('storage', checkAdminStatus);
  }, [location]);

  const navItems = [
    { path: '/', label: 'Home', icon: <FaHome /> },
    { path: '/register', label: 'Register Interest', icon: <FaUserPlus /> },
    { path: isAdminLoggedIn ? '/admin/dashboard' : '/admin', label: 'Admin', icon: <FaCog /> }
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          <FaHeartbeat className="navbar__logo-icon" />
          <span className="navbar__logo-text">AstraZeneca Clinical Trials</span>
        </Link>

        <button
          className={`navbar__mobile-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar__menu ${isMobileMenuOpen ? 'navbar__menu--open' : ''}`}>
          {navItems.map((item) => (
            <li key={item.path} className="navbar__item">
              <Link
                to={item.path}
                className={`navbar__link ${location.pathname === item.path ? 'navbar__link--active' : ''}`}
              >
                <span className="navbar__link-icon">{item.icon}</span>
                <span className="navbar__link-text">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

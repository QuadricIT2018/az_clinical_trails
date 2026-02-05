import React, { useState, useEffect } from 'react';
import { FaCog, FaSignInAlt, FaSignOutAlt, FaUserPlus, FaUsers, FaTrash, FaEye, FaCheck, FaTimes } from 'react-icons/fa';
import { authAPI, registrationsAPI } from '../services/api';
import Footer from '../components/Footer/Footer';
import './Admin.css';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          const response = await authAPI.verify();
          setAdminUser(response.data);
          setIsAuthenticated(true);
          fetchRegistrations();
        } catch (error) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await registrationsAPI.getAll();
      setRegistrations(response.data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      const response = await authAPI.login(loginForm);
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data));
      setAdminUser(response.data);
      setIsAuthenticated(true);
      fetchRegistrations();
    } catch (error) {
      setFormError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (registerForm.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    setFormLoading(true);

    try {
      const response = await authAPI.register({
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password
      });
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data));
      setAdminUser(response.data);
      setIsAuthenticated(true);
      fetchRegistrations();
    } catch (error) {
      setFormError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setAdminUser(null);
    setRegistrations([]);
    setLoginForm({ email: '', password: '' });
  };

  const handleDeleteRegistration = async (id) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      try {
        await registrationsAPI.delete(id);
        setRegistrations(prev => prev.filter(r => r._id !== id));
        if (selectedRegistration?._id === id) {
          setSelectedRegistration(null);
        }
      } catch (error) {
        console.error('Error deleting registration:', error);
      }
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await registrationsAPI.update(id, { status });
      setRegistrations(prev => prev.map(r => r._id === id ? response.data : r));
      if (selectedRegistration?._id === id) {
        setSelectedRegistration(response.data);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved': return 'admin__badge--success';
      case 'rejected': return 'admin__badge--danger';
      case 'reviewed': return 'admin__badge--warning';
      default: return 'admin__badge--info';
    }
  };

  if (isLoading) {
    return (
      <div className="admin">
        <div className="container">
          <div className="admin__loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="admin">
        <div className="container">
          <div className="admin__header">
            <h1 className="admin__title">
              <FaCog className="admin__title-icon" />
              <span>Admin Dashboard</span>
            </h1>
            {isAuthenticated && (
              <div className="admin__user-info">
                <span>Welcome, {adminUser?.username}</span>
                <button onClick={handleLogout} className="admin__logout-btn">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>

          {!isAuthenticated ? (
            <div className="admin__auth-container">
              <div className="admin__auth-box">
                <div className="admin__auth-tabs">
                  <button
                    className={`admin__auth-tab ${!showRegister ? 'active' : ''}`}
                    onClick={() => { setShowRegister(false); setFormError(''); }}
                  >
                    <FaSignInAlt /> Login
                  </button>
                  <button
                    className={`admin__auth-tab ${showRegister ? 'active' : ''}`}
                    onClick={() => { setShowRegister(true); setFormError(''); }}
                  >
                    <FaUserPlus /> Register
                  </button>
                </div>

                {formError && (
                  <div className="admin__auth-error">{formError}</div>
                )}

                {!showRegister ? (
                  <form onSubmit={handleLogin} className="admin__auth-form">
                    <div className="admin__auth-field">
                      <label>Email</label>
                      <input
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        required
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="admin__auth-field">
                      <label>Password</label>
                      <input
                        type="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                        placeholder="Enter your password"
                      />
                    </div>
                    <button type="submit" className="admin__auth-submit" disabled={formLoading}>
                      {formLoading ? 'Logging in...' : 'Login'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="admin__auth-form">
                    <div className="admin__auth-field">
                      <label>Username</label>
                      <input
                        type="text"
                        value={registerForm.username}
                        onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                        required
                        placeholder="Choose a username"
                      />
                    </div>
                    <div className="admin__auth-field">
                      <label>Email</label>
                      <input
                        type="email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        required
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="admin__auth-field">
                      <label>Password</label>
                      <input
                        type="password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        required
                        placeholder="Choose a password"
                      />
                    </div>
                    <div className="admin__auth-field">
                      <label>Confirm Password</label>
                      <input
                        type="password"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                        required
                        placeholder="Confirm your password"
                      />
                    </div>
                    <button type="submit" className="admin__auth-submit" disabled={formLoading}>
                      {formLoading ? 'Creating account...' : 'Create Admin Account'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          ) : (
            <div className="admin__dashboard">
              <div className="admin__stats">
                <div className="admin__stat-card">
                  <FaUsers className="admin__stat-icon" />
                  <div className="admin__stat-info">
                    <span className="admin__stat-number">{registrations.length}</span>
                    <span className="admin__stat-label">Total Registrations</span>
                  </div>
                </div>
                <div className="admin__stat-card">
                  <div className="admin__stat-info">
                    <span className="admin__stat-number">
                      {registrations.filter(r => r.status === 'pending').length}
                    </span>
                    <span className="admin__stat-label">Pending Review</span>
                  </div>
                </div>
                <div className="admin__stat-card">
                  <div className="admin__stat-info">
                    <span className="admin__stat-number">
                      {registrations.filter(r => r.status === 'approved').length}
                    </span>
                    <span className="admin__stat-label">Approved</span>
                  </div>
                </div>
              </div>

              <div className="admin__content">
                <div className="admin__registrations">
                  <h2 className="admin__section-title">Registrations</h2>
                  {registrations.length === 0 ? (
                    <div className="admin__empty">No registrations yet</div>
                  ) : (
                    <div className="admin__table-container">
                      <table className="admin__table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Age</th>
                            <th>ZIP Code</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registrations.map((reg) => (
                            <tr key={reg._id}>
                              <td>{reg.fullName}</td>
                              <td>{reg.email}</td>
                              <td>{reg.age || '-'}</td>
                              <td>{reg.zipCode || '-'}</td>
                              <td>
                                <span className={`admin__badge ${getStatusBadgeClass(reg.status)}`}>
                                  {reg.status}
                                </span>
                              </td>
                              <td>{formatDate(reg.createdAt)}</td>
                              <td>
                                <div className="admin__actions">
                                  <button
                                    className="admin__action-btn admin__action-btn--view"
                                    onClick={() => setSelectedRegistration(reg)}
                                    title="View details"
                                  >
                                    <FaEye />
                                  </button>
                                  <button
                                    className="admin__action-btn admin__action-btn--approve"
                                    onClick={() => handleUpdateStatus(reg._id, 'approved')}
                                    title="Approve"
                                  >
                                    <FaCheck />
                                  </button>
                                  <button
                                    className="admin__action-btn admin__action-btn--reject"
                                    onClick={() => handleUpdateStatus(reg._id, 'rejected')}
                                    title="Reject"
                                  >
                                    <FaTimes />
                                  </button>
                                  <button
                                    className="admin__action-btn admin__action-btn--delete"
                                    onClick={() => handleDeleteRegistration(reg._id)}
                                    title="Delete"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {selectedRegistration && (
                  <div className="admin__detail-panel">
                    <div className="admin__detail-header">
                      <h3>Registration Details</h3>
                      <button
                        className="admin__detail-close"
                        onClick={() => setSelectedRegistration(null)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <div className="admin__detail-content">
                      <div className="admin__detail-row">
                        <label>Full Name:</label>
                        <span>{selectedRegistration.fullName}</span>
                      </div>
                      <div className="admin__detail-row">
                        <label>Email:</label>
                        <span>{selectedRegistration.email}</span>
                      </div>
                      <div className="admin__detail-row">
                        <label>Phone:</label>
                        <span>{selectedRegistration.phone}</span>
                      </div>
                      <div className="admin__detail-row">
                        <label>Age:</label>
                        <span>{selectedRegistration.age || 'Not provided'}</span>
                      </div>
                      <div className="admin__detail-row">
                        <label>ZIP Code:</label>
                        <span>{selectedRegistration.zipCode || 'Not provided'}</span>
                      </div>
                      <div className="admin__detail-row">
                        <label>Health Information:</label>
                        <span>{selectedRegistration.healthInfo || 'None provided'}</span>
                      </div>
                      <div className="admin__detail-row">
                        <label>Status:</label>
                        <span className={`admin__badge ${getStatusBadgeClass(selectedRegistration.status)}`}>
                          {selectedRegistration.status}
                        </span>
                      </div>
                      <div className="admin__detail-row">
                        <label>Registered:</label>
                        <span>{formatDate(selectedRegistration.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Admin;

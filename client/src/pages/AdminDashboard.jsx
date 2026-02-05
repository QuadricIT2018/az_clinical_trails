import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaShieldAlt,
  FaUsers,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEnvelope,
  FaClipboardList,
  FaDna,
  FaSync,
  FaSignOutAlt,
  FaUserCheck,
  FaSearch,
  FaTimes,
  FaThLarge,
  FaCheckSquare,
  FaSquare,
  FaEye,
  FaCheck,
  FaCircle,
  FaUser
} from 'react-icons/fa';
import Footer from '../components/Footer/Footer';
import { registrationsAPI, cellTherapyAPI } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    pincode: '',
    eligibility: 'all',
    therapyType: 'all'
  });

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    eligible: 0,
    underReview: 0,
    emailsSent: 0,
    generalInterest: 0,
    cellTherapy: 0
  });

  // Check authentication
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn !== 'true') {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch registrations (General Interest)
      let generalSubmissions = [];
      try {
        const registrationsRes = await registrationsAPI.getAll();
        console.log('Registrations response:', registrationsRes.data);
        const registrationsData = registrationsRes.data.data || registrationsRes.data || [];
        generalSubmissions = registrationsData.map(item => ({
          ...item,
          therapyType: 'General',
          eligibility: item.status === 'approved' ? 'Eligible' : 'Under Review',
          emailSent: item.emailSent || false
        }));
      } catch (regError) {
        console.error('Error fetching registrations:', regError);
      }

      // Fetch cell therapy interest
      let cellTherapySubmissions = [];
      try {
        const cellTherapyRes = await cellTherapyAPI.getAll();
        console.log('Cell therapy response:', cellTherapyRes.data);
        const cellTherapyData = cellTherapyRes.data.data || cellTherapyRes.data || [];
        cellTherapySubmissions = cellTherapyData.map(item => ({
          ...item,
          therapyType: 'Cell Therapy',
          eligibility: item.status === 'eligible' ? 'Eligible' : 'Under Review',
          emailSent: item.status === 'contacted' || item.emailSent || false
        }));
      } catch (cellError) {
        console.error('Error fetching cell therapy:', cellError);
      }

      const allSubmissions = [...generalSubmissions, ...cellTherapySubmissions].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      console.log('All submissions:', allSubmissions);
      setSubmissions(allSubmissions);

      // Calculate statistics
      const eligible = allSubmissions.filter(s => s.eligibility === 'Eligible').length;
      const underReview = allSubmissions.filter(s => s.eligibility === 'Under Review').length;
      const emailsSent = allSubmissions.filter(s => s.emailSent).length;
      const general = generalSubmissions.length;
      const cellTherapy = cellTherapySubmissions.length;

      setStats({
        total: allSubmissions.length,
        eligible,
        underReview,
        emailsSent,
        generalInterest: general,
        cellTherapy
      });

      // Show error if both fetches failed
      if (generalSubmissions.length === 0 && cellTherapySubmissions.length === 0) {
        console.log('No data fetched - please ensure the server is running on port 5000');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load submissions. Please ensure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('adminToken');
    sessionStorage.clear();

    // Set logout success flag for the login page to display
    localStorage.setItem('logoutSuccess', 'true');

    // Navigate to login page
    navigate('/admin/login');
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      pincode: '',
      eligibility: 'all',
      therapyType: 'all'
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredSubmissions.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredSubmissions.map(s => s._id));
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
    } else {
      setSelectedRows(prev => [...prev, id]);
    }
  };

  const handleSendEmails = async () => {
    // Placeholder for email sending functionality
    alert(`Sending emails to ${selectedRows.length} selected participants...`);
    // In a real implementation, this would call an API endpoint
  };

  const handleViewDetails = (submission) => {
    setSelectedParticipant(submission);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedParticipant(null);
  };

  // Filter submissions
  const filteredSubmissions = submissions.filter(submission => {
    if (filters.pincode && !submission.zipCode?.includes(filters.pincode)) {
      return false;
    }
    if (filters.eligibility !== 'all') {
      if (filters.eligibility === 'eligible' && submission.eligibility !== 'Eligible') {
        return false;
      }
      if (filters.eligibility === 'under_review' && submission.eligibility !== 'Under Review') {
        return false;
      }
    }
    if (filters.therapyType !== 'all') {
      if (filters.therapyType === 'general' && submission.therapyType !== 'General') {
        return false;
      }
      if (filters.therapyType === 'cell_therapy' && submission.therapyType !== 'Cell Therapy') {
        return false;
      }
    }
    return true;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16).replace('T', ' ');
  };

  return (
    <>
      <div className="admin-dashboard">
        <div className="container">
          {/* Dashboard Header */}
          <div className="admin-dashboard__header">
            <div className="admin-dashboard__header-left">
              <FaShieldAlt className="admin-dashboard__header-icon" />
              <h1 className="admin-dashboard__title">Admin Dashboard</h1>
            </div>
            <div className="admin-dashboard__header-right">
              <span className="admin-dashboard__logged-in-badge">
                <FaUserCheck />
                <span>Admin Logged In</span>
              </span>
              <button onClick={fetchData} className="admin-dashboard__refresh-btn" disabled={loading}>
                <FaSync className={loading ? 'spinning' : ''} />
                <span>Refresh</span>
              </button>
              <button onClick={handleLogout} className="admin-dashboard__logout-btn">
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="admin-dashboard__stats">
            <div className="admin-dashboard__stats-row">
              <div className="admin-dashboard__stat-card admin-dashboard__stat-card--burgundy">
                <FaUsers className="admin-dashboard__stat-icon" />
                <div className="admin-dashboard__stat-content">
                  <span className="admin-dashboard__stat-number">{stats.total}</span>
                  <span className="admin-dashboard__stat-label">Total Submissions</span>
                </div>
              </div>
              <div className="admin-dashboard__stat-card admin-dashboard__stat-card--green">
                <FaCheckCircle className="admin-dashboard__stat-icon" />
                <div className="admin-dashboard__stat-content">
                  <span className="admin-dashboard__stat-number">{stats.eligible}</span>
                  <span className="admin-dashboard__stat-label">Eligible Participants</span>
                </div>
              </div>
              <div className="admin-dashboard__stat-card admin-dashboard__stat-card--gold">
                <FaExclamationTriangle className="admin-dashboard__stat-icon" />
                <div className="admin-dashboard__stat-content">
                  <span className="admin-dashboard__stat-number">{stats.underReview}</span>
                  <span className="admin-dashboard__stat-label">Under Review</span>
                </div>
              </div>
              <div className="admin-dashboard__stat-card admin-dashboard__stat-card--purple">
                <FaEnvelope className="admin-dashboard__stat-icon" />
                <div className="admin-dashboard__stat-content">
                  <span className="admin-dashboard__stat-number">{stats.emailsSent}</span>
                  <span className="admin-dashboard__stat-label">Emails Sent</span>
                </div>
              </div>
            </div>
            <div className="admin-dashboard__stats-row admin-dashboard__stats-row--wide">
              <div className="admin-dashboard__stat-card admin-dashboard__stat-card--cyan">
                <FaClipboardList className="admin-dashboard__stat-icon" />
                <div className="admin-dashboard__stat-content">
                  <span className="admin-dashboard__stat-number">{stats.generalInterest}</span>
                  <span className="admin-dashboard__stat-label">General Interest</span>
                </div>
              </div>
              <div className="admin-dashboard__stat-card admin-dashboard__stat-card--violet">
                <FaDna className="admin-dashboard__stat-icon" />
                <div className="admin-dashboard__stat-content">
                  <span className="admin-dashboard__stat-number">{stats.cellTherapy}</span>
                  <span className="admin-dashboard__stat-label">Cell Therapy Interest</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filter Section */}
          <div className="admin-dashboard__filters">
            <div className="admin-dashboard__filters-header">
              <FaSearch className="admin-dashboard__filters-icon" />
              <h2 className="admin-dashboard__filters-title">Search & Filter</h2>
            </div>
            <div className="admin-dashboard__filters-grid">
              <div className="admin-dashboard__filter-group">
                <label className="admin-dashboard__filter-label">Search by Pincode</label>
                <input
                  type="text"
                  value={filters.pincode}
                  onChange={(e) => handleFilterChange('pincode', e.target.value)}
                  placeholder="Enter pincode"
                  className="admin-dashboard__filter-input"
                />
              </div>
              <div className="admin-dashboard__filter-group">
                <label className="admin-dashboard__filter-label">Eligibility Status</label>
                <select
                  value={filters.eligibility}
                  onChange={(e) => handleFilterChange('eligibility', e.target.value)}
                  className="admin-dashboard__filter-select"
                >
                  <option value="all">All Participants</option>
                  <option value="eligible">Eligible Only</option>
                  <option value="under_review">Under Review Only</option>
                </select>
              </div>
              <div className="admin-dashboard__filter-group">
                <label className="admin-dashboard__filter-label">Therapy Type</label>
                <select
                  value={filters.therapyType}
                  onChange={(e) => handleFilterChange('therapyType', e.target.value)}
                  className="admin-dashboard__filter-select"
                >
                  <option value="all">All Therapies</option>
                  <option value="general">General Interest</option>
                  <option value="cell_therapy">Cell Therapy</option>
                </select>
              </div>
            </div>
            <div className="admin-dashboard__filters-buttons">
              <button onClick={() => {}} className="admin-dashboard__filter-btn admin-dashboard__filter-btn--search">
                <FaSearch />
                <span>Search</span>
              </button>
              <button onClick={clearFilters} className="admin-dashboard__filter-btn admin-dashboard__filter-btn--clear">
                <FaTimes />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="admin-dashboard__table-section">
            <div className="admin-dashboard__table-header">
              <div className="admin-dashboard__table-header-left">
                <FaThLarge className="admin-dashboard__table-icon" />
                <span>Participant Submissions ({filteredSubmissions.length} results)</span>
              </div>
              <div className="admin-dashboard__table-header-right">
                <button onClick={handleSelectAll} className="admin-dashboard__select-all-btn">
                  <FaCheckSquare />
                  <span>Select All</span>
                </button>
                <button onClick={() => setSelectedRows([])} className="admin-dashboard__clear-all-btn">
                  <FaSquare />
                  <span>Clear All</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="admin-dashboard__loading">
                <FaSync className="spinning" />
                <p>Loading submissions...</p>
              </div>
            ) : error ? (
              <div className="admin-dashboard__error">
                <p>{error}</p>
                <button onClick={fetchData}>Try Again</button>
              </div>
            ) : (
              <div className="admin-dashboard__table-wrapper">
                <table className="admin-dashboard__table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Pincode</th>
                      <th>Age</th>
                      <th>Therapy Type</th>
                      <th>Eligibility</th>
                      <th>Email Status</th>
                      <th>Submitted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan="11" className="admin-dashboard__no-data">
                          No submissions found
                        </td>
                      </tr>
                    ) : (
                      filteredSubmissions.map((submission, index) => (
                        <tr key={submission._id || index} className={index % 2 === 0 ? '' : 'admin-dashboard__table-row--alt'}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(submission._id)}
                              onChange={() => handleSelectRow(submission._id)}
                              className="admin-dashboard__checkbox"
                            />
                          </td>
                          <td>{submission.fullName}</td>
                          <td>
                            <a href={`mailto:${submission.email}`} className="admin-dashboard__link">
                              {submission.email}
                            </a>
                          </td>
                          <td>
                            <a href={`tel:${submission.mobileNumber || submission.phone}`} className="admin-dashboard__link">
                              {submission.mobileNumber || submission.phone}
                            </a>
                          </td>
                          <td>
                            <span className="admin-dashboard__pincode-badge">
                              {submission.zipCode}
                            </span>
                          </td>
                          <td>{submission.age}</td>
                          <td>
                            <span className={`admin-dashboard__type-badge admin-dashboard__type-badge--${submission.therapyType === 'Cell Therapy' ? 'cell' : 'general'}`}>
                              {submission.therapyType === 'Cell Therapy' ? <FaDna /> : <FaClipboardList />}
                              <span>{submission.therapyType}</span>
                            </span>
                          </td>
                          <td>
                            <span className={`admin-dashboard__eligibility-badge admin-dashboard__eligibility-badge--${submission.eligibility === 'Eligible' ? 'eligible' : 'review'}`}>
                              {submission.eligibility === 'Eligible' ? <FaCheck /> : <FaExclamationTriangle />}
                              <span>{submission.eligibility}</span>
                            </span>
                          </td>
                          <td>
                            <span className={`admin-dashboard__email-badge admin-dashboard__email-badge--${submission.emailSent ? 'sent' : 'not-sent'}`}>
                              {submission.emailSent ? <FaCheck /> : <FaCircle />}
                              <span>{submission.emailSent ? 'Sent' : 'Not Sent'}</span>
                            </span>
                          </td>
                          <td>{formatDate(submission.createdAt)}</td>
                          <td>
                            <button
                              onClick={() => handleViewDetails(submission)}
                              className="admin-dashboard__action-btn"
                            >
                              <FaEye />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <div className="admin-dashboard__table-footer">
              <span className="admin-dashboard__selected-count">
                {selectedRows.length} selected
              </span>
              <button
                onClick={handleSendEmails}
                disabled={selectedRows.length === 0}
                className="admin-dashboard__send-emails-btn"
              >
                <FaEnvelope />
                <span>Send Emails to Selected</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Participant Details Modal */}
      {showModal && (
        <div className="admin-dashboard__modal-overlay" onClick={closeModal}>
          <div className="admin-dashboard__modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-dashboard__modal-header">
              <FaUser className="admin-dashboard__modal-header-icon" />
              <h2 className="admin-dashboard__modal-title">Participant Details</h2>
              <button className="admin-dashboard__modal-close" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>
            <div className="admin-dashboard__modal-body">
              {selectedParticipant && (
                <div className="admin-dashboard__modal-details">
                  <div className="admin-dashboard__modal-row">
                    <span className="admin-dashboard__modal-label">Full Name:</span>
                    <span className="admin-dashboard__modal-value">{selectedParticipant.fullName}</span>
                  </div>
                  <div className="admin-dashboard__modal-row">
                    <span className="admin-dashboard__modal-label">Email:</span>
                    <span className="admin-dashboard__modal-value">{selectedParticipant.email}</span>
                  </div>
                  <div className="admin-dashboard__modal-row">
                    <span className="admin-dashboard__modal-label">Phone:</span>
                    <span className="admin-dashboard__modal-value">{selectedParticipant.mobileNumber || selectedParticipant.phone}</span>
                  </div>
                  <div className="admin-dashboard__modal-row">
                    <span className="admin-dashboard__modal-label">Age:</span>
                    <span className="admin-dashboard__modal-value">{selectedParticipant.age || 'N/A'}</span>
                  </div>
                  <div className="admin-dashboard__modal-row">
                    <span className="admin-dashboard__modal-label">Zip Code:</span>
                    <span className="admin-dashboard__modal-value">{selectedParticipant.zipCode || 'N/A'}</span>
                  </div>
                  <div className="admin-dashboard__modal-row">
                    <span className="admin-dashboard__modal-label">Therapy Type:</span>
                    <span className="admin-dashboard__modal-value">{selectedParticipant.therapyType}</span>
                  </div>
                  <div className="admin-dashboard__modal-row">
                    <span className="admin-dashboard__modal-label">Eligibility:</span>
                    <span className={`admin-dashboard__eligibility-badge admin-dashboard__eligibility-badge--${selectedParticipant.eligibility === 'Eligible' ? 'eligible' : 'review'}`}>
                      {selectedParticipant.eligibility === 'Eligible' ? <FaCheck /> : <FaExclamationTriangle />}
                      <span>{selectedParticipant.eligibility}</span>
                    </span>
                  </div>
                  <div className="admin-dashboard__modal-row">
                    <span className="admin-dashboard__modal-label">Email Status:</span>
                    <span className={`admin-dashboard__email-badge admin-dashboard__email-badge--${selectedParticipant.emailSent ? 'sent' : 'not-sent'}`}>
                      {selectedParticipant.emailSent ? <FaCheck /> : <FaCircle />}
                      <span>{selectedParticipant.emailSent ? 'Sent' : 'Not Sent'}</span>
                    </span>
                  </div>
                  <div className="admin-dashboard__modal-row">
                    <span className="admin-dashboard__modal-label">Submitted:</span>
                    <span className="admin-dashboard__modal-value">{formatDate(selectedParticipant.createdAt)}</span>
                  </div>
                  {selectedParticipant.healthInfo && (
                    <div className="admin-dashboard__modal-row admin-dashboard__modal-row--full">
                      <span className="admin-dashboard__modal-label">Health Information:</span>
                      <span className="admin-dashboard__modal-value">{selectedParticipant.healthInfo}</span>
                    </div>
                  )}
                  {selectedParticipant.medicalConditions && (
                    <div className="admin-dashboard__modal-row admin-dashboard__modal-row--full">
                      <span className="admin-dashboard__modal-label">Medical Conditions:</span>
                      <span className="admin-dashboard__modal-value">{selectedParticipant.medicalConditions}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="admin-dashboard__modal-footer">
              <button className="admin-dashboard__modal-close-btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default AdminDashboard;

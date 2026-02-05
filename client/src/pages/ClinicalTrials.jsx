import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaDna,
  FaMicroscope,
  FaUserPlus,
  FaShieldVirus,
  FaBullseye,
  FaUserMd,
  FaSyncAlt,
  FaFlask,
  FaMapMarkerAlt,
  FaPhone,
  FaCheck,
  FaInfoCircle,
  FaClipboardList,
  FaArrowLeft,
  FaExternalLinkAlt,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import Footer from '../components/Footer/Footer';
import './ClinicalTrials.css';

const ClinicalTrials = () => {
  const [trials, setTrials] = useState([]);
  const [totalTrials, setTotalTrials] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const trialsPerPage = 12;

  // Use ref to store page tokens to avoid infinite loops
  const pageTokensRef = useRef({ 1: null });

  useEffect(() => {
    const fetchTrials = async () => {
      setLoading(true);
      setError(null);

      try {
        const baseUrl = 'https://clinicaltrials.gov/api/v2/studies';
        const params = new URLSearchParams({
          'query.spons': 'AstraZeneca',
          'pageSize': trialsPerPage.toString(),
          'countTotal': 'true',
          'format': 'json'
        });

        // Add page token for pagination (if not first page)
        const pageToken = pageTokensRef.current[currentPage];
        if (pageToken) {
          params.append('pageToken', pageToken);
        }

        const response = await fetch(`${baseUrl}?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to fetch trials');
        }

        const data = await response.json();
        setTrials(data.studies || []);
        setTotalTrials(data.totalCount || 0);

        // Store next page token for pagination
        if (data.nextPageToken) {
          pageTokensRef.current[currentPage + 1] = data.nextPageToken;
        }
      } catch (err) {
        setError('Unable to load clinical trials. Please try again later.');
        console.error('Error fetching trials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrials();
  }, [currentPage]);

  const handleRefresh = () => {
    setLoading(true);
    setError(null);

    const fetchTrials = async () => {
      try {
        const baseUrl = 'https://clinicaltrials.gov/api/v2/studies';
        const params = new URLSearchParams({
          'query.spons': 'AstraZeneca',
          'pageSize': trialsPerPage.toString(),
          'countTotal': 'true',
          'format': 'json'
        });

        const pageToken = pageTokensRef.current[currentPage];
        if (pageToken) {
          params.append('pageToken', pageToken);
        }

        const response = await fetch(`${baseUrl}?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to fetch trials');
        }

        const data = await response.json();
        setTrials(data.studies || []);
        setTotalTrials(data.totalCount || 0);

        if (data.nextPageToken) {
          pageTokensRef.current[currentPage + 1] = data.nextPageToken;
        }
      } catch (err) {
        setError('Unable to load clinical trials. Please try again later.');
        console.error('Error fetching trials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrials();
  };

  const totalPages = Math.ceil(totalTrials / trialsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 2, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'RECRUITING':
        return 'clinical-trials__card-status--recruiting';
      case 'ACTIVE_NOT_RECRUITING':
        return 'clinical-trials__card-status--active';
      case 'COMPLETED':
        return 'clinical-trials__card-status--completed';
      case 'TERMINATED':
        return 'clinical-trials__card-status--terminated';
      case 'NOT_YET_RECRUITING':
        return 'clinical-trials__card-status--not-yet';
      default:
        return 'clinical-trials__card-status--other';
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status.replace(/_/g, ' ');
  };

  const features = [
    {
      icon: <FaShieldVirus />,
      title: 'CAR-T Technology',
      description: 'Chimeric Antigen Receptor T-cell therapy uses your own immune cells, modified to better recognize and attack cancer cells.',
      iconBg: 'burgundy'
    },
    {
      icon: <FaBullseye />,
      title: 'Targeted Treatment',
      description: 'Specifically designed to target GPC3-positive tumors in advanced hepatocellular carcinoma with precision.',
      iconBg: 'gold'
    },
    {
      icon: <FaUserMd />,
      title: 'Personalized Medicine',
      description: 'Each treatment is customized using the patient\'s own cells, offering a personalized approach to cancer therapy.',
      iconBg: 'burgundy'
    }
  ];

  const eligibilityItems = [
    { bold: 'Age 18-65 years', regular: ' for most clinical trials' },
    { bold: 'Specific cancer diagnosis', regular: ' matching trial criteria (e.g., Hepatocellular Carcinoma)' },
    { bold: 'Previous treatment history', regular: ' as specified by the protocol' },
    { bold: 'Adequate organ function', regular: ' to safely receive treatment' },
    { bold: 'Performance status', regular: ' sufficient for participation' }
  ];

  return (
    <>
      <div className="clinical-trials">
        {/* Hero Section */}
        <section className="clinical-trials__hero">
          <div className="container">
            <div className="clinical-trials__hero-content">
              <div className="clinical-trials__hero-text">
                <h1 className="clinical-trials__hero-title">
                  <FaDna className="clinical-trials__hero-title-icon" />
                  <span>Clinical Trials</span>
                </h1>
                <p className="clinical-trials__hero-subtitle">
                  Explore AstraZeneca's groundbreaking clinical trials using innovative technologies for advanced cancer treatment. Join the forefront of personalized medicine that could transform patient care.
                </p>
                <div className="clinical-trials__hero-buttons">
                  <Link to="/register" className="clinical-trials__hero-btn clinical-trials__hero-btn--primary">
                    <FaUserPlus className="clinical-trials__hero-btn-icon" />
                    <span>Express Interest</span>
                  </Link>
                  <a
                    href="https://www.astrazenecaclinicaltrials.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="clinical-trials__hero-btn clinical-trials__hero-btn--secondary"
                  >
                    <FaExternalLinkAlt className="clinical-trials__hero-btn-icon" />
                    <span>Learn More</span>
                  </a>
                </div>
              </div>
              <div className="clinical-trials__hero-visual">
                <FaMicroscope className="clinical-trials__hero-microscope" />
              </div>
            </div>
          </div>
        </section>

        {/* Innovative Clinical Research Section */}
        <section className="clinical-trials__research">
          <div className="container">
            <h2 className="clinical-trials__research-title">Innovative Clinical Research</h2>
            <p className="clinical-trials__research-subtitle">
              Our clinical trials represent revolutionary approaches to cancer treatment, including cell therapies, targeted treatments, and innovative therapeutic solutions designed to improve patient outcomes with unprecedented precision.
            </p>

            <div className="clinical-trials__features">
              {features.map((feature, index) => (
                <div key={index} className="clinical-trials__feature-card">
                  <div className={`clinical-trials__feature-icon clinical-trials__feature-icon--${feature.iconBg}`}>
                    {feature.icon}
                  </div>
                  <h3 className="clinical-trials__feature-title">{feature.title}</h3>
                  <p className="clinical-trials__feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Current Clinical Trials Section */}
        <section className="clinical-trials__current">
          <div className="container">
            <div className="clinical-trials__current-header">
              <div className="clinical-trials__current-title-row">
                <h2 className="clinical-trials__current-title">Current Clinical Trials</h2>
                <span className="clinical-trials__count-badge">{totalTrials} Available</span>
              </div>
              <p className="clinical-trials__current-subtitle">
                Explore our active clinical trials investigating innovative treatments for advanced cancer patients. Data updated from ClinicalTrials.gov API.
              </p>
            </div>

            <div className="clinical-trials__api-header">
              <button onClick={handleRefresh} className="clinical-trials__refresh-btn" disabled={loading}>
                <FaSyncAlt className={loading ? 'spinning' : ''} />
                <span>AstraZeneca Clinical Trials</span>
              </button>
              <span className="clinical-trials__api-source">(Live from ClinicalTrials.gov)</span>
            </div>

            {loading && (
              <div className="clinical-trials__loading">
                <FaSyncAlt className="spinning" />
                <p>Loading clinical trials...</p>
              </div>
            )}

            {error && (
              <div className="clinical-trials__error">
                <p>{error}</p>
                <button onClick={handleRefresh} className="clinical-trials__retry-btn">
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && (
              <>
                <div className="clinical-trials__grid">
                  {trials.map((trial, index) => {
                    const study = trial.protocolSection;
                    const nctId = study?.identificationModule?.nctId || 'Unknown';
                    const title = study?.identificationModule?.briefTitle || 'Untitled Study';
                    const description = study?.descriptionModule?.briefSummary || 'No description available.';
                    const phase = study?.designModule?.phases?.[0] || 'Unknown Phase';
                    const status = study?.statusModule?.overallStatus || 'Unknown';
                    const conditions = study?.conditionsModule?.conditions || [];
                    const locations = study?.contactsLocationsModule?.locations || [];

                    return (
                      <div key={index} className="clinical-trials__card">
                        <div className="clinical-trials__card-header">
                          <FaFlask className="clinical-trials__card-flask" />
                          <div className="clinical-trials__card-id">{nctId}</div>
                          <div className="clinical-trials__card-sponsor">AstraZeneca</div>
                        </div>
                        <div className="clinical-trials__card-body">
                          <h3 className="clinical-trials__card-title">{title}</h3>
                          <p className="clinical-trials__card-description">{description}</p>
                          <div className="clinical-trials__card-info">
                            <div className="clinical-trials__card-info-box">
                              <FaFlask className="clinical-trials__card-info-icon" />
                              <span>{phase.replace('PHASE', 'Phase ')}</span>
                            </div>
                            <div className="clinical-trials__card-info-box">
                              <FaMapMarkerAlt className="clinical-trials__card-info-icon" />
                              <span>{locations.length} Sites</span>
                            </div>
                          </div>
                          {conditions.length > 0 && (
                            <p className="clinical-trials__card-condition">
                              <strong>Condition:</strong> {conditions[0]}
                            </p>
                          )}
                        </div>
                        <div className="clinical-trials__card-footer">
                          <span className={`clinical-trials__card-status ${getStatusClass(status)}`}>
                            {formatStatus(status)}
                          </span>
                          <Link
                            to={`/trial/${nctId}`}
                            className="clinical-trials__card-details"
                          >
                            Details <FaExternalLinkAlt />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="clinical-trials__pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="clinical-trials__page-btn clinical-trials__page-btn--nav"
                    >
                      <FaChevronLeft /> Prev
                    </button>

                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={index} className="clinical-trials__page-ellipsis">...</span>
                      ) : (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(page)}
                          className={`clinical-trials__page-btn ${currentPage === page ? 'clinical-trials__page-btn--active' : ''}`}
                        >
                          {page}
                        </button>
                      )
                    ))}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="clinical-trials__page-btn clinical-trials__page-btn--nav"
                    >
                      Next <FaChevronRight />
                    </button>
                  </div>
                )}

                <p className="clinical-trials__pagination-info">
                  Showing page {currentPage} of {totalPages} ({trials.length} trials on this page, {totalTrials} total)
                </p>
              </>
            )}
          </div>
        </section>

        {/* Trial Locations Section */}
        <section className="clinical-trials__locations">
          <div className="container">
            <h2 className="clinical-trials__locations-title">Trial Locations</h2>
            <p className="clinical-trials__locations-subtitle">
              Our cell therapy trials are conducted at leading medical centers with expertise in cellular therapy.
            </p>

            <div className="clinical-trials__locations-grid">
              <div className="clinical-trials__location-card">
                <div className="clinical-trials__location-icon">
                  <FaMapMarkerAlt />
                </div>
                <h3 className="clinical-trials__location-name">UCSF (University of California, San Francisco)</h3>
                <div className="clinical-trials__location-contact">
                  <FaPhone />
                  <span>Contact: 888-689-8273</span>
                </div>
              </div>
              <div className="clinical-trials__location-card">
                <div className="clinical-trials__location-icon">
                  <FaMapMarkerAlt />
                </div>
                <h3 className="clinical-trials__location-name">Multiple International Sites</h3>
                <div className="clinical-trials__location-contact">
                  <FaPhone />
                  <span>Contact: Contact study coordinator</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clinical Trial Eligibility Section */}
        <section className="clinical-trials__eligibility">
          <div className="container">
            <div className="clinical-trials__eligibility-content">
              <div className="clinical-trials__eligibility-list">
                <h2 className="clinical-trials__eligibility-title">Clinical Trial Eligibility</h2>
                <ul className="clinical-trials__eligibility-items">
                  {eligibilityItems.map((item, index) => (
                    <li key={index} className="clinical-trials__eligibility-item">
                      <FaCheck className="clinical-trials__eligibility-check" />
                      <span><strong>{item.bold}</strong>{item.regular}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="clinical-trials__eligibility-info">
                <div className="clinical-trials__info-box">
                  <FaInfoCircle className="clinical-trials__info-icon" />
                  <h3 className="clinical-trials__info-title">Important Information</h3>
                  <p className="clinical-trials__info-text">
                    Clinical trials have specific eligibility criteria that may differ from other cancer treatments. A thorough medical evaluation is required to determine suitability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="clinical-trials__cta">
          <div className="container">
            <h2 className="clinical-trials__cta-title">Ready to Explore Clinical Trial Options?</h2>
            <p className="clinical-trials__cta-subtitle">
              Express your interest in our clinical trials. Our research team will review your information and contact you if you may be eligible for participation.
            </p>
            <div className="clinical-trials__cta-buttons">
              <Link to="/register" className="clinical-trials__cta-btn clinical-trials__cta-btn--primary">
                <FaClipboardList className="clinical-trials__cta-btn-icon" />
                <span>Express Interest in Clinical Trials</span>
              </Link>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="clinical-trials__cta-btn clinical-trials__cta-btn--secondary"
              >
                <FaArrowLeft className="clinical-trials__cta-btn-icon" />
                <span>Back to All Trials</span>
              </button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default ClinicalTrials;

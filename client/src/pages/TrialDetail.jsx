import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaUsers,
  FaBuilding,
  FaMapMarkerAlt,
  FaChartBar,
  FaUserCheck,
  FaDatabase,
  FaHeartbeat,
  FaUserPlus,
  FaUser,
  FaClock,
  FaShieldAlt
} from 'react-icons/fa';
import Footer from '../components/Footer/Footer';
import TrialMap from '../components/TrialMap/TrialMap';
import './TrialDetail.css';

const TrialDetail = () => {
  const { nctId } = useParams();
  const navigate = useNavigate();
  const [trial, setTrial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    const fetchTrialDetail = async () => {
      if (hasFetchedRef.current) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://clinicaltrials.gov/api/v2/studies/${nctId}?format=json`
        );

        if (!response.ok) {
          throw new Error('Trial not found');
        }

        const data = await response.json();
        setTrial(data);
        hasFetchedRef.current = true;
      } catch (err) {
        setError('Unable to load trial details. Please try again later.');
        console.error('Error fetching trial:', err);
      } finally {
        setLoading(false);
      }
    };

    if (nctId) {
      fetchTrialDetail();
    }
  }, [nctId]);

  // Parse eligibility criteria into inclusion and exclusion
  const parseEligibilityCriteria = (criteriaText) => {
    if (!criteriaText) return { inclusion: [], exclusion: [] };

    const lines = criteriaText.split('\n').filter(line => line.trim());
    const inclusion = [];
    const exclusion = [];
    let currentSection = null;

    lines.forEach(line => {
      const trimmedLine = line.trim();
      const lowerLine = trimmedLine.toLowerCase();

      if (lowerLine.includes('inclusion criteria') || lowerLine.includes('inclusion:')) {
        currentSection = 'inclusion';
      } else if (lowerLine.includes('exclusion criteria') || lowerLine.includes('exclusion:')) {
        currentSection = 'exclusion';
      } else if (trimmedLine.startsWith('*') || trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
        const cleanLine = trimmedLine.replace(/^[\*\-•]\s*/, '');
        if (currentSection === 'inclusion') {
          inclusion.push(cleanLine);
        } else if (currentSection === 'exclusion') {
          exclusion.push(cleanLine);
        }
      } else if (trimmedLine && currentSection) {
        if (currentSection === 'inclusion') {
          inclusion.push(trimmedLine);
        } else if (currentSection === 'exclusion') {
          exclusion.push(trimmedLine);
        }
      }
    });

    return { inclusion, exclusion };
  };

  if (loading) {
    return (
      <>
        <div className="trial-detail">
          <div className="trial-detail__loading">
            <div className="trial-detail__spinner"></div>
            <p>Loading trial details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !trial) {
    return (
      <>
        <div className="trial-detail">
          <div className="container">
            <div className="trial-detail__error">
              <p>{error || 'Trial not found'}</p>
              <button onClick={() => navigate('/clinical-trials')} className="trial-detail__error-btn">
                Back to Clinical Trials
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const study = trial.protocolSection;
  const identification = study?.identificationModule || {};
  const status = study?.statusModule || {};
  const description = study?.descriptionModule || {};
  const design = study?.designModule || {};
  const conditions = study?.conditionsModule?.conditions || [];
  const interventions = study?.armsInterventionsModule?.interventions || [];
  const keywords = study?.conditionsModule?.keywords || [];
  const eligibility = study?.eligibilityModule || {};
  const contacts = study?.contactsLocationsModule || {};
  const sponsor = study?.sponsorCollaboratorsModule || {};

  const briefTitle = identification.briefTitle || 'Untitled Study';
  const officialTitle = identification.officialTitle || '';
  const acronym = identification.acronym || '';
  const overallStatus = status.overallStatus || 'Unknown';
  const phase = design.phases?.[0] || 'Unknown';
  const studyType = design.studyType || 'Unknown';
  const startDate = status.startDateStruct?.date || 'TBD';
  const enrollment = design.enrollmentInfo?.count || 'TBD';
  const leadSponsor = sponsor.leadSponsor?.name || 'AstraZeneca';
  const locations = contacts.locations || [];
  const briefSummary = description.briefSummary || 'No summary available.';
  const detailedDescription = description.detailedDescription || '';

  const designInfo = design.designInfo || {};
  const allocation = designInfo.allocation || 'N/A';
  const interventionModel = designInfo.interventionModel || 'N/A';
  const primaryPurpose = designInfo.primaryPurpose || 'N/A';
  const masking = designInfo.maskingInfo?.masking || 'N/A';

  const gender = eligibility.sex || 'ALL';
  const minAge = eligibility.minimumAge || '18 Years';
  const maxAge = eligibility.maximumAge || 'No max';
  const healthyVolunteers = eligibility.healthyVolunteers ? 'Yes' : 'No';
  const { inclusion, exclusion } = parseEligibilityCriteria(eligibility.eligibilityCriteria);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaChartBar /> },
    { id: 'eligibility', label: 'Eligibility', icon: <FaUserCheck /> },
    { id: 'locations', label: 'Locations', icon: <FaMapMarkerAlt /> },
    { id: 'fulldata', label: 'Full Data', icon: <FaDatabase /> }
  ];

  return (
    <>
      <div className="trial-detail">
        {/* Hero Section with Back Button */}
        <section className="trial-detail__hero">
          <div className="container">
            {/* Back Button Inside Hero */}
            <button onClick={() => navigate('/clinical-trials')} className="trial-detail__back-btn">
              <FaArrowLeft />
              <span>Back to Cell Therapy Trials</span>
            </button>

            <div className="trial-detail__hero-content">
              <div className="trial-detail__hero-main">
                <h1 className="trial-detail__hero-title">{briefTitle}</h1>
                {officialTitle && (
                  <p className="trial-detail__hero-subtitle">{officialTitle}</p>
                )}
                {acronym && (
                  <p className="trial-detail__hero-acronym">Study Acronym: {acronym}</p>
                )}
                <div className="trial-detail__hero-badges">
                  <span className="trial-detail__badge">{overallStatus.replace(/_/g, ' ')}</span>
                  <span className="trial-detail__badge">{phase.replace('PHASE', 'PHASE ')}</span>
                  <span className="trial-detail__badge">{studyType}</span>
                </div>
              </div>
              <div className="trial-detail__hero-nct">
                <span className="trial-detail__nct-id">{nctId}</span>
                <a
                  href={`https://clinicaltrials.gov/study/${nctId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="trial-detail__nct-link"
                >
                  ClinicalTrials.gov <FaExternalLinkAlt />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Key Info Cards */}
        <section className="trial-detail__info-cards">
          <div className="container">
            <div className="trial-detail__cards-grid">
              <div className="trial-detail__info-card trial-detail__info-card--purple">
                <div className="trial-detail__info-card-icon-wrapper trial-detail__info-card-icon-wrapper--purple">
                  <FaCalendarAlt className="trial-detail__info-card-icon" />
                </div>
                <span className="trial-detail__info-card-title">Start Date</span>
                <span className="trial-detail__info-card-value">{startDate}</span>
              </div>
              <div className="trial-detail__info-card trial-detail__info-card--gold">
                <div className="trial-detail__info-card-icon-wrapper trial-detail__info-card-icon-wrapper--gold">
                  <FaUsers className="trial-detail__info-card-icon" />
                </div>
                <span className="trial-detail__info-card-title">Target Enrollment</span>
                <span className="trial-detail__info-card-value">{enrollment} participants</span>
              </div>
              <div className="trial-detail__info-card trial-detail__info-card--green">
                <div className="trial-detail__info-card-icon-wrapper trial-detail__info-card-icon-wrapper--green">
                  <FaBuilding className="trial-detail__info-card-icon" />
                </div>
                <span className="trial-detail__info-card-title">Sponsor</span>
                <span className="trial-detail__info-card-value">{leadSponsor}</span>
              </div>
              <div className="trial-detail__info-card trial-detail__info-card--magenta">
                <div className="trial-detail__info-card-icon-wrapper trial-detail__info-card-icon-wrapper--magenta">
                  <FaMapMarkerAlt className="trial-detail__info-card-icon" />
                </div>
                <span className="trial-detail__info-card-title">Study Locations</span>
                <span className="trial-detail__info-card-value">{locations.length} sites</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="trial-detail__tabs-section">
          <div className="container">
            <div className="trial-detail__tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`trial-detail__tab ${activeTab === tab.id ? 'trial-detail__tab--active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Tab Content */}
        <section className="trial-detail__content">
          <div className="container">
            {activeTab === 'overview' && (
              <div className="trial-detail__overview">
                <div className="trial-detail__overview-main">
                  <div className="trial-detail__section">
                    <h2 className="trial-detail__section-title">Study Description</h2>

                    <div className="trial-detail__subsection">
                      <h3 className="trial-detail__subsection-title">Brief Summary</h3>
                      <p className="trial-detail__text">{briefSummary}</p>
                    </div>

                    {detailedDescription && (
                      <div className="trial-detail__subsection">
                        <h3 className="trial-detail__subsection-title">Detailed Description</h3>
                        <p className="trial-detail__text">{detailedDescription}</p>
                      </div>
                    )}

                    <div className="trial-detail__subsection">
                      <h3 className="trial-detail__subsection-title">Study Design</h3>
                      <div className="trial-detail__design-grid">
                        <div className="trial-detail__design-item">
                          <span className="trial-detail__design-label">Allocation:</span>
                          <span className="trial-detail__design-value">{allocation}</span>
                        </div>
                        <div className="trial-detail__design-item">
                          <span className="trial-detail__design-label">Intervention Model:</span>
                          <span className="trial-detail__design-value">{interventionModel}</span>
                        </div>
                        <div className="trial-detail__design-item">
                          <span className="trial-detail__design-label">Primary Purpose:</span>
                          <span className="trial-detail__design-value">{primaryPurpose}</span>
                        </div>
                        <div className="trial-detail__design-item">
                          <span className="trial-detail__design-label">Masking:</span>
                          <span className="trial-detail__design-value">{masking}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="trial-detail__overview-sidebar">
                  <div className="trial-detail__sidebar-section">
                    <h3 className="trial-detail__sidebar-title">Conditions</h3>
                    <div className="trial-detail__conditions">
                      {conditions.length > 0 ? (
                        conditions.map((condition, index) => (
                          <span key={index} className="trial-detail__condition-badge">{condition}</span>
                        ))
                      ) : (
                        <p className="trial-detail__empty">No conditions listed</p>
                      )}
                    </div>
                  </div>

                  <div className="trial-detail__sidebar-section">
                    <h3 className="trial-detail__sidebar-title">Interventions</h3>
                    <div className="trial-detail__interventions">
                      {interventions.length > 0 ? (
                        interventions.map((intervention, index) => (
                          <div key={index} className="trial-detail__intervention">
                            <span className="trial-detail__intervention-type">{intervention.type}</span>
                            <span className="trial-detail__intervention-name">{intervention.name}</span>
                          </div>
                        ))
                      ) : (
                        <p className="trial-detail__empty">No interventions listed</p>
                      )}
                    </div>
                  </div>

                  <div className="trial-detail__sidebar-section">
                    <h3 className="trial-detail__sidebar-title">Keywords</h3>
                    <div className="trial-detail__keywords">
                      {keywords.length > 0 ? (
                        keywords.map((keyword, index) => (
                          <span key={index} className="trial-detail__keyword">{keyword}</span>
                        ))
                      ) : (
                        <p className="trial-detail__empty">No keywords listed</p>
                      )}
                    </div>
                  </div>

                  {/* CTA Box */}
                  <div className="trial-detail__cta-box">
                    <FaHeartbeat className="trial-detail__cta-icon" />
                    <h3 className="trial-detail__cta-title">Interested in This Trial?</h3>
                    <p className="trial-detail__cta-text">
                      Connect with our team to learn more about participation opportunities
                    </p>
                    <div className="trial-detail__cta-buttons">
                      <Link to={`/cell-therapy-interest/${nctId}`} className="trial-detail__cta-btn trial-detail__cta-btn--primary">
                        <FaUserPlus />
                        <span>Express Interest in This Trial</span>
                      </Link>
                      <a
                        href={`https://clinicaltrials.gov/study/${nctId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="trial-detail__cta-btn trial-detail__cta-btn--secondary"
                      >
                        <FaExternalLinkAlt />
                        <span>View on ClinicalTrials.gov</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'eligibility' && (
              <div className="trial-detail__eligibility-tab">
                {/* Eligibility Info Cards */}
                <div className="trial-detail__eligibility-cards">
                  <div className="trial-detail__eligibility-card trial-detail__eligibility-card--burgundy">
                    <div className="trial-detail__eligibility-card-icon-wrapper trial-detail__eligibility-card-icon-wrapper--burgundy">
                      <FaUser className="trial-detail__eligibility-card-icon" />
                    </div>
                    <span className="trial-detail__eligibility-card-title">Gender</span>
                    <span className="trial-detail__eligibility-card-value">{gender}</span>
                  </div>
                  <div className="trial-detail__eligibility-card trial-detail__eligibility-card--gold">
                    <div className="trial-detail__eligibility-card-icon-wrapper trial-detail__eligibility-card-icon-wrapper--gold">
                      <FaClock className="trial-detail__eligibility-card-icon" />
                    </div>
                    <span className="trial-detail__eligibility-card-title">Age Range</span>
                    <span className="trial-detail__eligibility-card-value">{minAge} - {maxAge}</span>
                  </div>
                  <div className="trial-detail__eligibility-card trial-detail__eligibility-card--green">
                    <div className="trial-detail__eligibility-card-icon-wrapper trial-detail__eligibility-card-icon-wrapper--green">
                      <FaShieldAlt className="trial-detail__eligibility-card-icon" />
                    </div>
                    <span className="trial-detail__eligibility-card-title">Healthy Volunteers</span>
                    <span className="trial-detail__eligibility-card-value">{healthyVolunteers}</span>
                  </div>
                </div>

                {/* Detailed Criteria */}
                <div className="trial-detail__criteria-section">
                  <h3 className="trial-detail__criteria-heading">Detailed Criteria</h3>

                  {inclusion.length > 0 && (
                    <div className="trial-detail__criteria-block">
                      <h4 className="trial-detail__criteria-subheading">Inclusion Criteria:</h4>
                      <div className="trial-detail__criteria-list">
                        {inclusion.map((item, index) => (
                          <div key={index} className="trial-detail__criteria-item">
                            <span className="trial-detail__criteria-bullet">*</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {exclusion.length > 0 && (
                    <div className="trial-detail__criteria-block">
                      <h4 className="trial-detail__criteria-subheading">Exclusion Criteria:</h4>
                      <div className="trial-detail__criteria-list">
                        {exclusion.map((item, index) => (
                          <div key={index} className="trial-detail__criteria-item">
                            <span className="trial-detail__criteria-bullet">*</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {inclusion.length === 0 && exclusion.length === 0 && eligibility.eligibilityCriteria && (
                    <div className="trial-detail__criteria-raw">
                      <pre>{eligibility.eligibilityCriteria}</pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'locations' && (
              <div className="trial-detail__locations-tab">
                {/* Interactive Map */}
                <div className="trial-detail__map-container">
                  <TrialMap locations={locations} />
                </div>

                {/* All Study Sites */}
                <div className="trial-detail__sites-section">
                  <h3 className="trial-detail__sites-title">All Study Sites</h3>

                  {locations.length > 0 ? (
                    <div className="trial-detail__sites-grid">
                      {locations.map((location, index) => (
                        <div key={index} className="trial-detail__site-card">
                          <span className="trial-detail__site-label">Research Site</span>
                          <div className="trial-detail__site-address">
                            <FaMapMarkerAlt className="trial-detail__site-icon" />
                            <span>
                              {[location.city, location.state, location.zip].filter(Boolean).join(', ')}
                            </span>
                          </div>
                          <span className="trial-detail__site-country">{location.country}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="trial-detail__empty">No locations available yet.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'fulldata' && (
              <div className="trial-detail__fulldata-tab">
                <h2 className="trial-detail__fulldata-title">Complete Trial Data (JSON)</h2>
                <p className="trial-detail__fulldata-description">
                  This section contains all available data from ClinicalTrials.gov for this study.
                </p>
                <div className="trial-detail__json-container">
                  <pre className="trial-detail__json">{JSON.stringify(trial, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default TrialDetail;

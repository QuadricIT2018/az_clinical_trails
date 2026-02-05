import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './TrialMap.css';

// Fix for default marker icons in Leaflet with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom blue marker icon
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to fit map bounds to markers
const FitBounds = ({ locations }) => {
  const map = useMap();

  useEffect(() => {
    if (locations && locations.length > 0) {
      const validLocations = locations.filter(loc => loc.lat && loc.lng);
      if (validLocations.length > 0) {
        const bounds = L.latLngBounds(validLocations.map(loc => [loc.lat, loc.lng]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
      }
    }
  }, [map, locations]);

  return null;
};

// Simple geocoding cache to avoid repeated lookups
const geocodeCache = {};

// Simple geocoding function using OpenStreetMap Nominatim
const geocodeLocation = async (location) => {
  const searchString = [location.city, location.state, location.country]
    .filter(Boolean)
    .join(', ');

  if (!searchString) return null;

  // Check cache first
  if (geocodeCache[searchString]) {
    return geocodeCache[searchString];
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchString)}&limit=1`,
      {
        headers: {
          'User-Agent': 'AZClinicalTrials/1.0'
        }
      }
    );

    if (!response.ok) return null;

    const data = await response.json();

    if (data && data.length > 0) {
      const result = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
      geocodeCache[searchString] = result;
      return result;
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }

  return null;
};

const TrialMap = ({ locations = [] }) => {
  const [geocodedLocations, setGeocodedLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const geocodeAllLocations = async () => {
      setLoading(true);

      const results = [];

      // Process locations with a small delay between each to respect rate limits
      for (let i = 0; i < locations.length; i++) {
        const location = locations[i];

        // Check if location already has coordinates
        if (location.geoPoint?.lat && location.geoPoint?.lon) {
          results.push({
            ...location,
            lat: location.geoPoint.lat,
            lng: location.geoPoint.lon
          });
        } else {
          // Try to geocode
          const coords = await geocodeLocation(location);
          if (coords) {
            results.push({
              ...location,
              lat: coords.lat,
              lng: coords.lng
            });
          }
        }

        // Small delay between requests to avoid rate limiting
        if (i < locations.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      setGeocodedLocations(results);
      setLoading(false);
    };

    if (locations.length > 0) {
      geocodeAllLocations();
    } else {
      setLoading(false);
    }
  }, [locations]);

  const validLocations = geocodedLocations.filter(loc => loc.lat && loc.lng);

  // Default center (US) if no valid locations
  const defaultCenter = [39.8283, -98.5795];
  const defaultZoom = 4;

  if (loading) {
    return (
      <div className="trial-map__loading">
        <div className="trial-map__spinner"></div>
        <p>Loading map locations...</p>
      </div>
    );
  }

  return (
    <div className="trial-map">
      <MapContainer
        center={validLocations.length > 0 ? [validLocations[0].lat, validLocations[0].lng] : defaultCenter}
        zoom={defaultZoom}
        className="trial-map__container"
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validLocations.map((location, index) => (
          <Marker
            key={index}
            position={[location.lat, location.lng]}
            icon={blueIcon}
          >
            <Popup>
              <div className="trial-map__popup">
                {location.facility && (
                  <strong className="trial-map__popup-facility">{location.facility}</strong>
                )}
                <span className="trial-map__popup-address">
                  {[location.city, location.state, location.zip].filter(Boolean).join(', ')}
                </span>
                <span className="trial-map__popup-country">{location.country}</span>
                {location.status && (
                  <span className={`trial-map__popup-status trial-map__popup-status--${location.status.toLowerCase().replace(/_/g, '-')}`}>
                    {location.status.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {validLocations.length > 1 && <FitBounds locations={validLocations} />}
      </MapContainer>

      <div className="trial-map__info">
        <span className="trial-map__count">
          Showing {validLocations.length} of {locations.length} locations
        </span>
      </div>
    </div>
  );
};

export default TrialMap;

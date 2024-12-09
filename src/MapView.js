// src/MapView.js
import React, { useContext, useMemo, useEffect } from 'react';
import { DataContext } from './DataContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

function MapComponent({ points, globalMode }) {
  const map = useMap();

  useEffect(() => {
    if (globalMode) {
      // Global view
      map.setView([20, 0], 2);
    } else {
      // Local mode: fit bounds to points if available
      if (points.length > 0) {
        const latlngs = points.map(p => [p.latitude, p.longitude]);
        const bounds = L.latLngBounds(latlngs);
        map.fitBounds(bounds, { maxZoom: 5 });
      } else {
        // No points, default global
        map.setView([20,0], 2);
      }
    }
  }, [globalMode, points, map]);

  return (
    <>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup>
        {points.map((p, i) => (
          <Marker key={i} position={[p.latitude, p.longitude]} icon={markerIcon}>
            <Popup>
              <strong>{p.filename}</strong><br />
              {p.datetime_utc}<br />
              {/* Keep old comments:
                  Now we must show city/state/country from locations array.
                  p.city, p.state, p.country no longer exist directly in p. */}
              {p.city && `City: ${p.city}`}<br />
              {p.state && `State: ${p.state}`}<br />
              {p.country && `Country: ${p.country}`}
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </>
  );
}

function MapView({ selectedYear, selectedMonth, globalMode }) {
  const { data } = useContext(DataContext);
  const items = data.items || [];
  const locations = data.locations || [];

  // Keep old filtering logic
  const filteredData = useMemo(() => {
    return items.filter(item => {
      const d = new Date(item.datetime_utc);
      const yearMatches = !selectedYear || d.getFullYear() === selectedYear;
      const monthMatches = (selectedMonth == null) || d.getMonth() === selectedMonth;
      return yearMatches && monthMatches;
    });
  }, [items, selectedYear, selectedMonth]);

  // points now must include city/state/country from locations
  const points = useMemo(() => {
    return filteredData
      .filter(item => item.latitude && item.longitude)
      .map(item => {
        const loc = locations[item.location_id] || {};
        // Merge location fields into the item for display in popup
        return {
          ...item,
          city: loc.city || '',
          state: loc.state || '',
          country: loc.country || ''
        };
      });
  }, [filteredData, locations]);

  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
      <MapComponent points={points} globalMode={globalMode} />
    </MapContainer>
  );
}

export default MapView;

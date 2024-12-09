// src/ChartsView.js
import React, { useContext, useMemo } from 'react';
import { DataContext } from './DataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

function isPhoto(item) {
  const mt = (item.mediatype || '').toLowerCase();
  const fn = (item.filename || '').toLowerCase();
  // Check mediatype or filename extension
  if (mt.includes('image') || mt.includes('photo')) return true;
  if (/\.(jpg|jpeg|png|heic)$/i.test(fn)) return true;
  return false;
}

function isVideo(item) {
  const mt = (item.mediatype || '').toLowerCase();
  const fn = (item.filename || '').toLowerCase();
  if (mt.includes('video')) return true;
  if (/\.(mp4|mov|m4v)$/i.test(fn)) return true;
  return false;
}

function ChartsView({ selectedYear, selectedMonth }) {
  const { data } = useContext(DataContext);

  // data is now {locations: [...], items: [...]}
  const items = data.items || [];
  const locations = data.locations || [];

  // Keep old comment:
  // Filter items by selectedYear/selectedMonth
  const filteredData = useMemo(() => {
    return items.filter(item => {
      const d = new Date(item.datetime_utc);
      const yearMatches = !selectedYear || d.getFullYear() === selectedYear;
      const monthMatches = (selectedMonth == null) || d.getMonth() === selectedMonth;
      return yearMatches && monthMatches;
    });
  }, [items, selectedYear, selectedMonth]);

  // cityCount now must look up city from locations
  const cityCount = useMemo(() => {
    const count = {};
    filteredData.forEach(item => {
      const loc = locations[item.location_id]; // new line: retrieve location
      if (loc && loc.city) {
        count[loc.city] = (count[loc.city] || 0) + 1;
      }
    });
    const arr = Object.entries(count).map(([city, cnt]) => ({ city, count: cnt }));
    arr.sort((a, b) => b.count - a.count);
    return arr.slice(0, 10);
  }, [filteredData, locations]);

  const photoCount = filteredData.filter(isPhoto).length;
  const videoCount = filteredData.filter(isVideo).length;

  return (
    <div style={{ padding: '10px', color: '#ccc' }}>
      <h3 style={{ color: '#fff', marginBottom: '10px' }}>Top Cities</h3>
      {cityCount.length > 0 ? (
        <BarChart
          width={320}
          height={200}
          data={cityCount}
          margin={{ top: 20, right: 20, left: 20, bottom: 80 }}
        >
          <XAxis
            dataKey="city"
            tick={{ fontSize: 12, fill: '#ccc' }}
            angle={-45}
            textAnchor="end"
            interval={0}
          />
          <YAxis tick={{ fill: '#ccc' }} />
          <Tooltip wrapperStyle={{ color: '#000' }} />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      ) : (
        <div>No city data available.</div>
      )}
      <div style={{ marginTop: '15px', color: '#ccc' }}>
        <p>Photos Indexed: {photoCount}</p>
        <p>Videos Indexed: {videoCount}</p>
      </div>
    </div>
  );
}

export default ChartsView;

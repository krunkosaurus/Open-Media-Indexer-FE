// src/ChartsView.js
import React, { useContext, useMemo } from 'react';
import { DataContext } from './DataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function isPhoto(item) {
  const mt = (item.mediatype || '').toLowerCase();
  const fn = (item.filename || '').toLowerCase();
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
      const loc = locations[item.location_id];
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

  // Compute yearData for ALL items (not just filteredData), because we want overall per-year counts.
  const yearData = useMemo(() => {
    const yearMap = {};
    for (const item of items) {
      const d = new Date(item.datetime_utc);
      const y = d.getFullYear();
      if (!isNaN(y)) {
        if (!yearMap[y]) {
          yearMap[y] = { year: y, photos: 0, videos: 0 };
        }
        if (isPhoto(item)) {
          yearMap[y].photos++;
        } else if (isVideo(item)) {
          yearMap[y].videos++;
        }
      }
    }

    const arr = Object.values(yearMap);
    arr.sort((a, b) => a.year - b.year);
    return arr;
  }, [items]);

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
        <p>Photos Indexed: {photoCount.toLocaleString()}</p>
        <p>Videos Indexed: {videoCount.toLocaleString()}</p>
      </div>

      {/* Images & Videos Indexed by Year chart below Top Cities */}
      <h4 style={{ margin: '20px 0 10px 0', color: '#fff' }}>Images & Videos Indexed by Year</h4>
      {yearData.length > 0 ? (
        <div style={{ width: '100%', height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yearData} margin={{ top: 20, right: 20, left: 20, bottom: 40 }}>
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#ccc' }} angle={-45} textAnchor="end" />
              <YAxis tick={{ fill: '#ccc' }} />
              <Tooltip wrapperStyle={{ color: '#000' }} />
              <Legend wrapperStyle={{ color: '#ccc' }} />
              <Bar dataKey="photos" stackId="a" fill="#8884d8" name="Photos" />
              <Bar dataKey="videos" stackId="a" fill="#82ca9d" name="Videos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{ color: '#ccc' }}>No data available.</div>
      )}
    </div>
  );
}

export default ChartsView;

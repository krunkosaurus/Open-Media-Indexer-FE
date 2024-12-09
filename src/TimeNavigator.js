// src/TimeNavigator.js
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { DataContext } from './DataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

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

function TimeNavigator({ selectedYear, selectedMonth, onChangeYear, onChangeMonth, globalMode, onGlobalModeChange }) {
  const [playing, setPlaying] = useState(false);
  const { data } = useContext(DataContext);
  const items = data.items || [];

  useEffect(() => {
    let interval;
    if (playing && selectedYear != null) {
      interval = setInterval(() => {
        const nextMonth = selectedMonth == null ? 0 : selectedMonth + 1;
        if (nextMonth > 11) {
          // Stop at year's end
          onChangeMonth(null);
          setPlaying(false);
        } else {
          onChangeMonth(nextMonth);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [playing, selectedYear, selectedMonth, onChangeMonth]);

  const handlePlayPause = () => setPlaying(!playing);
  const handleNext = () => {
    if (selectedYear == null) return;
    const m = (selectedMonth == null) ? 0 : selectedMonth + 1;
    if (m <= 11) onChangeMonth(m);
  };
  const handlePrev = () => {
    if (selectedYear == null) return;
    const m = (selectedMonth == null) ? 11 : selectedMonth - 1;
    if (m >= 0) onChangeMonth(m);
  };

  const displayYear = selectedYear ?? 'All Years';

  let displayMonthStr = '--';
  if (selectedMonth != null) {
    const monthIndex = selectedMonth;
    const monthName = new Date(2021, monthIndex).toLocaleString('default', { month: 'long' });
    const monthNumber = String(monthIndex + 1).padStart(2, '0');
    displayMonthStr = `${monthName} (Month ${monthNumber})`;
  }

  // Aggregate photos/videos by year for the stacked bar chart
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
    <div style={{ padding: '10px', borderTop: '1px solid #333', marginTop: '10px' }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#fff' }}>Jump Through Time</h4>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <button onClick={handlePlayPause} style={{ background: '#333', color: '#ccc', border: 'none', padding: '5px' }}>
          {playing ? 'Pause' : 'Play'}
        </button>
        <button onClick={handlePrev} style={{ background: '#333', color: '#ccc', border: 'none', padding: '5px' }}>◀</button>
        <button onClick={handleNext} style={{ background: '#333', color: '#ccc', border: 'none', padding: '5px' }}>▶</button>
      </div>
      <div style={{ marginBottom: '10px', color: '#ccc' }}>
        Year: {displayYear}, {displayMonthStr}
      </div>
      <div style={{ marginBottom: '10px', color: '#ccc' }}>
        <label style={{ cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={globalMode}
            onChange={() => onGlobalModeChange(!globalMode)}
            style={{ marginRight: '5px', verticalAlign: 'middle' }}
          />
          Pin Global View
        </label>
      </div>

      {/* New Stacked Bar Chart section */}
      <h4 style={{ margin: '20px 0 10px 0', color: '#fff' }}>Images & Videos Indexed by Year</h4>
      {yearData.length > 0 ? (
        <BarChart
          width={400}
          height={250}
          data={yearData}
          margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
        >
          <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#ccc' }} angle={-45} textAnchor="end" />
          <YAxis tick={{ fill: '#ccc' }} />
          <Tooltip wrapperStyle={{ color: '#000' }} />
          <Legend wrapperStyle={{ color: '#ccc' }} />
          <Bar dataKey="photos" stackId="a" fill="#8884d8" name="Photos" />
          <Bar dataKey="videos" stackId="a" fill="#82ca9d" name="Videos" />
        </BarChart>
      ) : (
        <div style={{ color: '#ccc' }}>No data available.</div>
      )}
    </div>
  );
}

export default TimeNavigator;

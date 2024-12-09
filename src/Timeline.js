// src/Timeline.js
import React, { useContext, useMemo } from 'react';
import { DataContext } from './DataContext';

function Timeline({ selectedYear, setSelectedYear }) {
  const { data } = useContext(DataContext);

  // data is now { locations: [...], items: [...] }
  const items = data.items || []; // new line: extract items from data

  // Keep old comment:
  // useMemo to compute the years from datetime_utc fields of items
  const years = useMemo(() => {
    const validYears = items
      .map(item => {
        const d = new Date(item.datetime_utc);
        const y = d.getFullYear();
        return isNaN(y) ? null : y;
      })
      .filter(y => y !== null);
    const unique = Array.from(new Set(validYears));
    unique.sort((a, b) => a - b);
    return unique;
  }, [items]);

  if (years.length === 0) {
    return <div style={{ padding: '10px' }}>No valid date data available.</div>;
  }

  const currentIndex = selectedYear ? years.indexOf(selectedYear) : -1;

  const goPrevYear = () => {
    if (currentIndex > 0) {
      setSelectedYear(years[currentIndex - 1]);
    }
  };

  const goNextYear = () => {
    if (currentIndex >= 0 && currentIndex < years.length - 1) {
      setSelectedYear(years[currentIndex + 1]);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <label>
        Filter by Year:
        <select
          value={selectedYear || ''}
          onChange={e => {
            const val = e.target.value;
            setSelectedYear(val ? parseInt(val, 10) : null);
          }}
          style={{ marginLeft: '5px' }}
        >
          <option value="">All</option>
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </label>
      <button onClick={goPrevYear} style={{ background: '#333', color: '#ccc', border: 'none', padding: '5px' }}>◀</button>
      <button onClick={goNextYear} style={{ background: '#333', color: '#ccc', border: 'none', padding: '5px' }}>▶</button>
    </div>
  );
}

export default Timeline;

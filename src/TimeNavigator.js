import React, { useState, useEffect } from 'react';

function TimeNavigator({ selectedYear, selectedMonth, onChangeYear, onChangeMonth, globalMode, onGlobalModeChange }) {
  const [playing, setPlaying] = useState(false);

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
          Global Mode
        </label>
      </div>
    </div>
  );
}

export default TimeNavigator;

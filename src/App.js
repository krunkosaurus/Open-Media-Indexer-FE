// src/App.js
import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from './DataContext';
import MapView from './MapView';
import Timeline from './Timeline';
import ChartsView from './ChartsView';
import TimeNavigator from './TimeNavigator';

function App() {
  const { setData } = useContext(DataContext);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [globalMode, setGlobalMode] = useState(false);

  useEffect(() => {
    // Create the parse worker on mount
    const worker = new Worker(new URL('./parseWorker.js', import.meta.url), { type: 'module' });
    worker.onmessage = (e) => {
      // No changes needed here for initial worker creation
      setData(e.data); // Initially might set something if needed
    };
    window.parseWorker = worker;
    return () => {
      worker.terminate();
    };
  }, [setData]);

  function handleFileLoad(e) {
    const file = e.target.files[0];
    if (!file) return;

    const worker = window.parseWorker; // assume already created
    worker.onmessage = (evt) => {
      if (evt.data.type === 'progress') {
        // Keep old comment:
        // Update UI: e.g. "Processing: X out of Y" or a fraction.
        const { processed, total } = evt.data;
        console.log(`Processed ${processed}${total ? '/' + total : ''} items`);
      } else if (evt.data.type === 'done') {
        // data fully loaded
        // evt.data.data is now an array with a single object: [ { locations: [...], items: [...] } ]
        // We take the first element to get our normalized data object
        const decodedData = evt.data.data[0]; // new line: select the single decoded object
        setData(decodedData);
        setLoading(false);
      }
    };

    setLoading(true);
    // Read file in chunks
    const chunkSize = 1024 * 1024; // 1MB per chunk
    let offset = 0;

    const readChunk = () => {
      const slice = file.slice(offset, offset + chunkSize);
      const reader = new FileReader();
      reader.onload = (evt) => {
        const arrayBuffer = evt.target.result;
        if (arrayBuffer.byteLength > 0) {
          // Send chunk to worker
          worker.postMessage({ type: 'chunk', chunk: arrayBuffer });
          offset += chunkSize;
          if (offset < file.size) {
            readChunk();
          } else {
            // Signal no more data
            worker.postMessage({ type: 'done' });
          }
        } else {
          // End of file
          worker.postMessage({ type: 'done' });
        }
      };
      reader.readAsArrayBuffer(slice);
    };

    readChunk();
  }

  return (
    <div className="wrapper">
      <header>
        <h1>Media Indexer</h1>
        <div>
          <label style={{ marginRight: '5px' }}>Select .msgpack:</label>
          <input type="file" onChange={handleFileLoad} accept=".msgpack" />
          {loading && <span style={{ marginLeft: '10px' }}>Loading...</span>}
        </div>
      </header>
      <div className="main-content">
        <div className="map-container">
          {/* MapView now expects data.items and data.locations. */}
          <MapView selectedYear={selectedYear} selectedMonth={selectedMonth} globalMode={globalMode} />
        </div>
        <div className="side-panel">
          {/* ChartsView expects items and retrieves city info from locations */}
          <ChartsView selectedYear={selectedYear} selectedMonth={selectedMonth}/>
          <TimeNavigator
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            onChangeYear={setSelectedYear}
            onChangeMonth={setSelectedMonth}
            globalMode={globalMode}
            onGlobalModeChange={setGlobalMode}
          />
        </div>
      </div>
      <div className="footer">
        {/* Timeline also expects items (through data) */}
        <Timeline selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
      </div>
    </div>
  );
}

export default App;

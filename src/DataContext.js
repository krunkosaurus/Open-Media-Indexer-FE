// src/DataContext.js
import React, { createContext, useState } from 'react';

// data will now be { locations: [...], items: [...] }
// We will store this object directly in data.
export const DataContext = createContext({ data: {}, setData: () => {} });

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({});
  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};

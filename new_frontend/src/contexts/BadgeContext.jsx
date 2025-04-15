import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSelectedBadge } from '../services/powerDataService';

const BadgeContext = createContext();

export const useBadge = () => useContext(BadgeContext);

export const BadgeProvider = ({ children }) => {
  const [badge, setBadge] = useState(null);

  // Load badge initially
  useEffect(() => {
    const fetchBadge = async () => {
      const selected = await getSelectedBadge();
      if (selected !== "No badge selected" && selected !== "Error getting selected badge") {
        setBadge(selected);
      }
    };
    fetchBadge();
  }, []);

  return (
    <BadgeContext.Provider value={{ badge, setBadge }}>
      {children}
    </BadgeContext.Provider>
  );
};

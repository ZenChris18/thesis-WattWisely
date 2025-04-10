// src/contexts/PointsContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { fetchTotalPoints } from "../services/powerDataService"; // Assuming you have this service to fetch points

// Create a context for points
const PointsContext = createContext();

// Create a custom hook to use points context
export const usePoints = () => {
  return useContext(PointsContext);
};

// Create a provider to wrap your components and provide the context
export const PointsProvider = ({ children }) => {
  const [totalPoints, setTotalPoints] = useState(0);

  // Fetch total points initially when the app loads
  useEffect(() => {
    const loadPoints = async () => {
      const points = await fetchTotalPoints();
      setTotalPoints(points);
    };

    loadPoints(); // Initial points load
  }, []);

  // Function to update points (for example, after claiming points)
  const handlePointsClaimed = async () => {
    const points = await fetchTotalPoints();
    setTotalPoints(points);
  };

  return (
    <PointsContext.Provider value={{ totalPoints, handlePointsClaimed }}>
      {children}
    </PointsContext.Provider>
  );
};

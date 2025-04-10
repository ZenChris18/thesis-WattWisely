import React, { createContext, useState, useContext, useEffect } from "react";
import { fetchTotalPoints } from "../services/powerDataService";

const PointsContext = createContext();

export const usePoints = () => {
  return useContext(PointsContext);
};

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

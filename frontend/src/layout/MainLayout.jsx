import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import StartScreen from "../components/StartScreen";

function MainLayout({ children }) {
  const [showStartScreen, setShowStartScreen] = useState(true);

  // Check localStorage on mount
  useEffect(() => {
    const hasSeenStartScreen = localStorage.getItem("startScreenShown") === "true";
    setShowStartScreen(!hasSeenStartScreen);
  }, []);

  const handleStart = () => {
    setShowStartScreen(false);
    localStorage.setItem("startScreenShown", "true"); // Store state
  };

  const handleExit = () => {
    setShowStartScreen(true); // Show Start Screen again
    localStorage.removeItem("startScreenShown"); // Reset localStorage
  };

  return (
    <div className="layout-container">
      {showStartScreen ? (
        <StartScreen onStart={handleStart} />
      ) : (
        <>
          <Navbar onExit={handleExit} /> {/* Pass handleExit to Navbar */}
          <div className="content">{children}</div>
        </>
      )}
    </div>
  );
}

export default MainLayout;

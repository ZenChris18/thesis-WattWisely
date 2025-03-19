/*import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './css/style.css';
import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Challenges from './pages/Challenges';
import Achievements from './pages/Achievements';

// Import Start & Loading Screens
import StartScreen from './components/StartScreen';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [showStartScreen, setShowStartScreen] = useState(
    localStorage.getItem('hasSeenStartScreen') ? false : true
  );
  const [showLoadingScreen, setShowLoadingScreen] = useState(
    localStorage.getItem('hasSeenLoadingScreen') ? false : true
  );

  useEffect(() => {
    if (showStartScreen) return;

    if (showLoadingScreen) {
      const timeout = setTimeout(() => {
        setShowLoadingScreen(false);
        localStorage.setItem('hasSeenLoadingScreen', 'true'); // ✅ Save that loading was seen
      }, 5500); // ⏳ Loading screen for 3 seconds

      return () => clearTimeout(timeout);
    }
  }, [showStartScreen, showLoadingScreen]);

  const handleStartScreenFinish = () => {
    localStorage.setItem('hasSeenStartScreen', 'true'); // ✅ Save that start screen was seen
    setShowStartScreen(false);
  };

  if (showStartScreen) return <StartScreen onFinish={handleStartScreenFinish} />;
  if (showLoadingScreen) return <LoadingScreen />;

  return (
    <Routes>
      <Route exact path="/" element={<Dashboard />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/challenges" element={<Challenges />} />
      <Route path="/achievements" element={<Achievements />} />
    </Routes>
  );
}

export default App;*/


//For Testing
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion'; // ✅ Import AnimatePresence
import './css/style.css';
import './charts/ChartjsConfig';

import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Challenges from './pages/Challenges';
import Achievements from './pages/Achievements';

import StartScreen from './components/StartScreen';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (!showStartScreen) {
      setShowLoadingScreen(true);
      const timeout = setTimeout(() => {
        setShowLoadingScreen(false);
        setAppReady(true);
      }, 5500);
      return () => clearTimeout(timeout);
    }
  }, [showStartScreen]);

  const handleStartScreenFinish = () => {
    setShowStartScreen(false);
  };

  return (
    <AnimatePresence mode="wait">
      {showStartScreen && <StartScreen onFinish={handleStartScreenFinish} />}
      {showLoadingScreen && <LoadingScreen />}
      {!appReady && null}

      {appReady && (
        <Routes>
          <Route exact path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/achievements" element={<Achievements />} />
        </Routes>
      )}
    </AnimatePresence>
  );
}

export default App;

 

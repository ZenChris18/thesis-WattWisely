//Real Code
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './css/style.css';
import './charts/ChartjsConfig';

import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Challenges from './pages/Challenges';
import Achievements from './pages/Achievements';

import StartScreen from './components/StartScreen';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [showStartScreen, setShowStartScreen] = useState(() => {
    return localStorage.getItem('hasSeenStartScreen') ? false : true;
  });
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
    localStorage.setItem('hasSeenStartScreen', 'true');
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



//For Testing

/* import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion'; // Import AnimatePresence
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
*/
 
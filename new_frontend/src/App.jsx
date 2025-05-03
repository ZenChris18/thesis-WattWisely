import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './css/style.css';
import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Challenges from './pages/Challenges';
import Badges from './pages/Badges';

import StartScreen from './components/StartScreen';
import LoadingScreen from './components/LoadingScreen';

// Import PointsProvider
import { PointsProvider } from './contexts/PointsContext';
import { BadgeProvider } from './contexts/BadgeContext';

// Auth components
import LoginWithLocalStorage from "./components/LoginWithLocalStorage/LoginWithLocalStorage";
import ProtectedRoute from './components/ProtectedRoute';

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
    <PointsProvider>
      <BadgeProvider>
        <AnimatePresence mode="wait">
          {showStartScreen && <StartScreen onFinish={handleStartScreenFinish} />}
          {showLoadingScreen && <LoadingScreen />}
          {!appReady && null}

          {appReady && (
            <Routes>
              <Route path="/tologin" element={<LoginWithLocalStorage />} />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />
              
              <Route path="/challenges" element={
                <ProtectedRoute>
                  <Challenges />
                </ProtectedRoute>
              } />
              
              <Route path="/badges" element={
                <ProtectedRoute>
                  <Badges />
                </ProtectedRoute>
              } />
            </Routes>
          )}
        </AnimatePresence>
      </BadgeProvider>
    </PointsProvider>
  );
}

export default App;
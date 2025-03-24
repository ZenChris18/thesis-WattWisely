import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Challenges from './pages/Challenges';
import Achivements from './pages/Achievements'

function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path='/challenges' element={<Challenges />} />
        <Route path='/achievements' element={<Achivements />} />
      </Routes>
    </>
  );
}

export default App;

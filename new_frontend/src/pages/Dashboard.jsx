import React, { useState, useRef, useEffect } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import DashboardCard01 from '../partials/dashboard/DashboardCard01';
import DashboardCard02 from '../partials/dashboard/DashboardCard02';
import DashboardCard03 from '../partials/dashboard/DashboardCard03';
import DashboardCardChallenges from '../partials/dashboard/DashboardCardChallenges';
import DashboardCardChallenges02 from '../partials/dashboard/DashboardCardChallenges02';
import { usePoints } from '../contexts/PointsContext';


function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("Past Hour");
  const dropdownRef = useRef(null);
  const { handlePointsClaimed } = usePoints();

  const handleSelectTimeframe = (timeframe) => {
    setSelectedTimeframe(timeframe);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                  Dashboard
                </h1>
              </div>

              {/* Timeframe Dropdown - Mobile Friendly */}
              <div className="relative inline-block text-left" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  {selectedTimeframe}
                </button>
                
                {dropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 min-w-[150px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => handleSelectTimeframe('Past Hour')}
                      className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Past Hour
                    </button>
                    <button
                      onClick={() => handleSelectTimeframe('Past Day')}
                      className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Past Day
                    </button>
                    <button
                      onClick={() => handleSelectTimeframe('Past Week')}
                      className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Past Week
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-12 gap-6">
              <DashboardCard01 selectedTimeframe={selectedTimeframe} />
              <DashboardCard02 selectedTimeframe={selectedTimeframe} />
              <DashboardCard03 />

              {/* Challenges Section */}
              <div className="col-span-12">
                <h2 className="text-xl font-bold mt-6">Challenges Progress</h2>
                <DashboardCardChallenges onPointsClaimed={handlePointsClaimed} /> {/* onPointsClaimed={handlePointsClaimed} so points in sidepanel update immediately if points claimed*/}
                <br></br>
                <DashboardCardChallenges02 onPointsClaimed={handlePointsClaimed} />
              </div>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}

export default Dashboard;

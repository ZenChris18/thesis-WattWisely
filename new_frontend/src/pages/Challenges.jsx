import React, { useState, useEffect } from "react";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import DashboardCardChallenges from "../partials/dashboard/DashboardCardChallenges";
import DashboardCardChallenges02 from "../partials/dashboard/DashboardCardChallenges02";
import { fetchTotalPoints } from "../services/powerDataService";

function Challenges() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const loadPoints = async () => {
      const points = await fetchTotalPoints();
      setTotalPoints(points);
    };

    loadPoints();
  }, []);

  const handlePointsClaimed = async () => {
    const points = await fetchTotalPoints();
    setTotalPoints(points);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mb-6">
              Challenges
            </h1>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              🌟 Watt Points: {totalPoints}
            </h2>

            {/* Challenges Section */}
            <div className="space-y-6">
              <DashboardCardChallenges showAll={true} onPointsClaimed={handlePointsClaimed} />
              <DashboardCardChallenges02 showAll={true} onPointsClaimed={handlePointsClaimed} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Challenges;

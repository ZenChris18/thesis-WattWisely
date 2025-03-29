import React, { useState, useEffect } from "react";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import DashboardCardChallenges from "../partials/dashboard/DashboardCardChallenges";
import DashboardCardChallenges02 from "../partials/dashboard/DashboardCardChallenges02";
import { fetchChallenges, fetchWeeklyChallenges } from "../services/powerDataService";

function Challenges() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const loadPoints = async () => {
      const dailyChallenges = await fetchChallenges();
      const weeklyChallenges = await fetchWeeklyChallenges();

      // Calculate total points (claimed only)
      const claimedPoints = [...dailyChallenges, ...weeklyChallenges]
        .filter((c) => c.claimed)
        .reduce((sum, c) => sum + (c.points || 0), 0);

      setTotalPoints(claimedPoints);
    };

    loadPoints();
  }, []);

  const handlePointsClaimed = (points) => {
    setTotalPoints((prevPoints) => prevPoints + points);
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

            {/* Wrap challenges in a div with spacing */}
            <div className="space-y-6">
              {/* Daily Challenges */}
              <DashboardCardChallenges showAll={true} onPointsClaimed={handlePointsClaimed} />

              {/* Weekly Challenges */}
              <DashboardCardChallenges02 showAll={true} onPointsClaimed={handlePointsClaimed} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Challenges;

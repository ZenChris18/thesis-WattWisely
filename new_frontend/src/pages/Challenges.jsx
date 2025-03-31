// Import React
import React, { useState, useEffect } from "react";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import DashboardCardChallenges from "../partials/dashboard/DashboardCardChallenges";
import DashboardCardChallenges02 from "../partials/dashboard/DashboardCardChallenges02";
import { fetchTotalPoints, fetchUnlockedBadges } from "../services/powerDataService";

const badgeImagePath = "/images/WattBadges/";

function Challenges() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const points = await fetchTotalPoints();
      setTotalPoints(points);

      const fetchedBadges = await fetchUnlockedBadges();
      setBadges(fetchedBadges);
    };

    loadData();
  }, []);

  const handlePointsClaimed = async () => {
    const points = await fetchTotalPoints();
    setTotalPoints(points);

    const fetchedBadges = await fetchUnlockedBadges();
    setBadges(fetchedBadges);
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

            {/* Badges Section */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                🏅 Unlocked Badges
              </h2>
              <div className="flex gap-4 flex-wrap">
                {badges.length > 0 ? (
                  badges.map((badge) => (
                    <div key={badge.id} className="flex flex-col items-center">
                      <img
                        src={`${badgeImagePath}${badge.badge__image}`}
                        alt={badge.badge__name}
                        className="w-16 h-16 object-contain"
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-300">{badge.badge__name}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No badges unlocked yet.</p>
                )}
              </div>
            </div>

            {/* Challenges */}
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

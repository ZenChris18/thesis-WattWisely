import React, { useState, useEffect } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { fetchBadges, fetchUnlockedBadges, fetchTotalPoints } from "../services/powerDataService";

const badgeImagePath = "/images/WattBadges/";

function Badges() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [badges, setBadges] = useState([]); 
  const [unlockedBadges, setUnlockedBadges] = useState(new Set());
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allBadges = await fetchBadges();
        console.log("All Badges:", allBadges); 
        const unlocked = await fetchUnlockedBadges();
        console.log("Unlocked Badges:", unlocked); 
        const points = await fetchTotalPoints();

        setBadges(allBadges);
        setTotalPoints(points);

        const unlockedIds = new Set(unlocked.map((b) => b.id)); 
        setUnlockedBadges(unlockedIds);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mb-6">
              Badges
            </h1>

            {/* Unlocked Badges */}
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              🏅 Unlocked Badges
            </h2>

            <div className="flex gap-4 flex-wrap">
              {badges.length > 0 ? (
                badges
                  .filter((badge) => unlockedBadges.has(badge.id)) // Only display unlocked badges
                  .map((badge) => (
                    <div key={badge.id} className="flex flex-col items-center">
                      <img
                        src={`${badgeImagePath}${badge.image}`} // image should be badge.image (from API)
                        alt={badge.name} // name should be badge.name (from API)
                        className="w-16 h-16 object-contain"
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-300">{badge.name}</p>
                      <div className="text-xs text-gray-500">Unlocked</div>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-gray-500">No badges unlocked yet.</p>
              )}
            </div>

            {/* Locked Badges */}
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-8 mb-4">
              🏅 Locked Badges
            </h2>

            <div className="flex gap-4 flex-wrap">
              {badges.length > 0 ? (
                badges
                  .filter((badge) => !unlockedBadges.has(badge.id)) // Only display locked badges
                  .map((badge) => (
                    <div key={badge.id} className="flex flex-col items-center opacity-50">
                      <img
                        src={`${badgeImagePath}${badge.image}`}
                        alt={badge.name}
                        className="w-16 h-16 object-contain"
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-300">{badge.name}</p>
                      <div className="text-xs text-gray-500">
                        Need {badge.threshold} points
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-gray-500">No locked badges available.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Badges;

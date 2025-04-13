import React from "react";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import DashboardCardChallenges from "../partials/dashboard/DashboardCardChallenges";
import DashboardCardChallenges02 from "../partials/dashboard/DashboardCardChallenges02";
import { usePoints } from "../contexts/PointsContext";

import { fetchUnlockedBadges } from "../services/powerDataService";

function Challenges() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { totalPoints, handlePointsClaimed } = usePoints();
  // this is to keep track of the unlocked badges for animation in badges page
  const prevUnlockedRef = React.useRef([]);

  React.useEffect(() => {
    const loadInitialUnlockedBadges = async () => {
      try {
        const unlocked = await fetchUnlockedBadges();
        prevUnlockedRef.current = unlocked.map((b) => b.id);
      } catch (err) {
        console.error("Failed to fetch initial badges", err);
      }
    };
    loadInitialUnlockedBadges();
  }, []);


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
              <DashboardCardChallenges
                showAll={true}
                onPointsClaimed={async () => {
                  await handlePointsClaimed();

                  try {
                    const newUnlocked = await fetchUnlockedBadges();
                    const newIds = newUnlocked.map((b) => b.id);

                    const previousIds = prevUnlockedRef.current;
                    const newlyUnlocked = newIds.filter((id) => !previousIds.includes(id));

                    if (newlyUnlocked.length > 0) {
                      localStorage.setItem("newUnlockedBadges", JSON.stringify(newlyUnlocked));
                      prevUnlockedRef.current = newIds; // Update ref
                    }
                  } catch (err) {
                    console.error("Error checking new badge unlocks:", err);
                  }
                }}
              />

              <DashboardCardChallenges02
                showAll={true}
                onPointsClaimed={async () => {
                  await handlePointsClaimed();

                  try {
                    const newUnlocked = await fetchUnlockedBadges();
                    const newIds = newUnlocked.map((b) => b.id);

                    const previousIds = prevUnlockedRef.current;
                    const newlyUnlocked = newIds.filter((id) => !previousIds.includes(id));

                    if (newlyUnlocked.length > 0) {
                      localStorage.setItem("newUnlockedBadges", JSON.stringify(newlyUnlocked));
                      prevUnlockedRef.current = newIds;
                    }
                  } catch (err) {
                    console.error("Error checking new badge unlocks:", err);
                  }
                }}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Challenges;

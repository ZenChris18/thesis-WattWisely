import React, { useState, useEffect } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { fetchBadges, fetchUnlockedBadges, fetchTotalPoints } from "../services/powerDataService";
import { motion } from "framer-motion";

const badgeImagePath = "/images/WattBadges/";

function Badges() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [badges, setBadges] = useState([]);
  const [unlockedBadges, setUnlockedBadges] = useState(new Set());
  const [unlockedDetails, setUnlockedDetails] = useState({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const loadData = async () => {
      try {
        const allBadges = await fetchBadges();
        const unlocked = await fetchUnlockedBadges();
        const points = await fetchTotalPoints();

        setBadges(allBadges);
        setTotalPoints(points);

        const unlockedIds = new Set(unlocked.map((b) => b.id));
        setUnlockedBadges(unlockedIds);

        const details = {};
        unlocked.forEach((b) => {
          details[b.id] = b.date_unlocked;
        });
        setUnlockedDetails(details);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  const filteredBadges = badges.filter((badge) => {
    if (filter === "unlocked") return unlockedBadges.has(badge.id);
    if (filter === "locked") return !unlockedBadges.has(badge.id);
    return true;
  });

  const renderBadgeCard = (badge, isUnlocked) => {
    const progress = Math.min((totalPoints / badge.threshold) * 100, 100);

    return (
      <motion.div
        key={badge.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`flex flex-col items-center justify-start p-4 rounded-xl w-44 shadow-md ${
          isUnlocked
            ? "bg-white dark:bg-gray-800"
            : "bg-gray-100 dark:bg-gray-700 opacity-70"
        } hover:scale-105 transition-transform`}
      >
        <img
          src={`${badgeImagePath}${badge.image}`}
          alt={badge.name}
          title={badge.name}
          className="w-24 h-24 object-contain mb-2"
        />
        <p className="text-sm text-center font-medium text-gray-800 dark:text-gray-100">
          {badge.name}
        </p>

        {isUnlocked ? (
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
            ✅ Unlocked on {new Date(unlockedDetails[badge.id]).toLocaleDateString()}
          </div>
        ) : (
          <>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-1">
              🔒 {badge.threshold} pts
            </div>
            <div className="w-full bg-gray-300 dark:bg-gray-600 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-2"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </>
        )}
      </motion.div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                Badges
              </h1>
              <div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100"
                >
                  <option value="all">All</option>
                  <option value="unlocked">Unlocked</option>
                  <option value="locked">Locked</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredBadges.length > 0 ? (
                filteredBadges.map((badge) =>
                  renderBadgeCard(badge, unlockedBadges.has(badge.id))
                )
              ) : (
                <p className="text-sm text-gray-500 col-span-full">
                  No badges available for this filter.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Badges;

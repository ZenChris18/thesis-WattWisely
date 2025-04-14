import React, { useState, useEffect } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import {
  fetchBadges,
  fetchUnlockedBadges,
  fetchTotalPoints,
} from "../services/powerDataService";
import { motion } from "framer-motion";
import { Dialog } from "@headlessui/react";

const badgeImagePath = "/images/WattBadges/";

const getBadgeEffects = (difficulty) => {
  switch (difficulty) {
    case "wattlord":
      return {
        glow: "shadow-[0_0_40px_10px_rgba(128,0,128,0.8)]",
        animation: {
          scale: [1, 1.13, 1],
          transition: {
            repeat: 2,
            duration: 1.2,
            ease: "easeInOut",
          },
        },
        aura: "bg-[radial-gradient(circle,_rgba(128,0,128,0.15)_0%,_transparent_70%)]",
      };
    case "wattmaster":
      return {
        glow: "shadow-[0_0_30px_5px_rgba(255,0,0,0.6)]",
        animation: {
          scale: [1, 1.09, 1],
          transition: {
            repeat: 2,
            duration: 1.5,
            ease: "easeInOut",
          },
        },
        aura: "bg-[radial-gradient(circle,_rgba(255,0,0,0.1)_0%,_transparent_70%)]",
      };
    case "wattknight":
      return {
        glow: "shadow-[0_0_20px_3px_rgba(30,144,255,0.4)]",
        animation: {
          scale: [1, 1.07, 1],
          transition: {
            repeat: 2,
            duration: 2,
            ease: "easeInOut",
          },
        },
        aura: "bg-[radial-gradient(circle,_rgba(30,144,255,0.1)_0%,_transparent_70%)]",
      };
    case "padawatt":
    default:
      return {
        glow: "shadow-[0_0_10px_2px_rgba(144,238,144,0.3)]",
        animation: {
          scale: [1, 1.03, 1],
          transition: {
            repeat: Infinity,
            duration: 2.5,
            ease: "easeInOut",
          },
        },
        aura: "",
      };
  }
};


function Badges() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [badges, setBadges] = useState([]);
  const [unlockedBadges, setUnlockedBadges] = useState(new Set());
  const [unlockedDetails, setUnlockedDetails] = useState({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [filter, setFilter] = useState("all");
  const [newlyUnlocked, setNewlyUnlocked] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState(null);

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

        const stored = localStorage.getItem("newUnlockedBadges");
        if (stored) {
          setNewlyUnlocked(JSON.parse(stored));
          localStorage.removeItem("newUnlockedBadges");
        }
      } catch (error) {
        console.error("Error loading badge data:", error);
      }
    };

    loadData();
  }, []);

  const filteredBadges = badges.filter((badge) => {
    if (filter === "unlocked") return unlockedBadges.has(badge.id);
    if (filter === "locked") return !unlockedBadges.has(badge.id);
    if (["padawatt", "wattknight", "wattmaster", "wattlord"].includes(filter))
      return badge.difficulty === filter;
    return true;
  });

  const renderBadgeCard = (badge, isUnlocked) => {
    const progress = Math.min((totalPoints / badge.threshold) * 100, 100);
    const isNewlyUnlocked = isUnlocked && newlyUnlocked.includes(badge.id);

    const difficultyClass = isUnlocked
      ? badge.difficulty === "padawatt"
        ? "border-animate-easy"
        : badge.difficulty === "wattknight"
        ? "border-animate-medium"
        : badge.difficulty === "wattmaster"
        ? "border-animate-hard"
        : badge.difficulty === "wattlord"
        ? "border-animate-legendary"
        : ""
      : "";
    
    return (
      <motion.div
        key={badge.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        onClick={() => setSelectedBadge(badge)}
        className={`relative cursor-pointer flex flex-col items-center justify-start p-4 rounded-2xl w-full max-w-[200px] shadow-lg
          ${isUnlocked ? "bg-white dark:bg-gray-800" : "bg-gray-100 dark:bg-gray-700 opacity-50"}
          ${isNewlyUnlocked ? "ring-4 ring-yellow-400 sunray-shine" : ""}
          ${difficultyClass}
        `}
      >
        <motion.img
          src={`/images/WattBadges/${badge.image}`}
          alt={badge.name}
          className={`relative z-10 w-28 h-28 object-contain mb-2 ${
            isUnlocked ? "" : "grayscale opacity-50"
          }`}
          animate={isNewlyUnlocked ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.6, repeat: 2 }}
        />
        <p className="text-sm text-center font-medium text-gray-800 dark:text-gray-100">
          {badge.name}
        </p>
        {isUnlocked ? (
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
            ✅ {new Date(unlockedDetails[badge.id]).toLocaleDateString()}
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
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                My Badges
              </h1>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100"
              >
                <option value="all">All</option>
                <option value="unlocked">Unlocked</option>
                <option value="locked">Locked</option>
                <option value="padawatt">Padawatt</option>
                <option value="wattknight">Wattknight</option>
                <option value="wattmaster">Wattmaster</option>
                <option value="wattlord">Wattlord</option>
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredBadges.length > 0 ? (
                filteredBadges.map((badge) =>
                  renderBadgeCard(badge, unlockedBadges.has(badge.id))
                )
              ) : (
                <p className="text-sm text-gray-500 col-span-full">
                  No badges available.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Badge Modal dimming effect */}
      {selectedBadge && (
  <Dialog open={true} onClose={() => setSelectedBadge(null)} className="relative z-50">
    {/* Overlay */}
    <div
      className="fixed inset-0"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      aria-hidden="true"
    />
    {/* Modal panel */}
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-auto shadow-2xl text-center">
        <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {selectedBadge.name}
        </Dialog.Title>
        
        {/* Here is where the effect should be applied */}
        {(() => {
          // Get the effects based on the badge's difficulty level
          const effects = getBadgeEffects(selectedBadge.difficulty);

          return (
            <div className={`relative w-64 h-64 mx-auto mb-4 flex items-center justify-center ${effects.aura}`}>
              <motion.img
                key={selectedBadge.id + "-animation"}
                src={`${badgeImagePath}${selectedBadge.image}`}
                alt={selectedBadge.name}
                className={`w-full h-full object-contain rounded-full ${effects.glow}`}
                animate={effects.animation}
              />
            </div>
          );
        })()}

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
          {selectedBadge.description || "No description available."}
        </p>
        {unlockedBadges.has(selectedBadge.id) ? (
          <p className="text-green-600 dark:text-green-400 text-sm">
            ✅ Unlocked on{" "}
            {new Date(unlockedDetails[selectedBadge.id]).toLocaleDateString()}
          </p>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            🔒 Requires {selectedBadge.threshold} points.
          </p>
        )}
        <button
          onClick={() => setSelectedBadge(null)}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
        >
          Close
        </button>
      </Dialog.Panel>
    </div>
  </Dialog>
)}
    </div>
  );
}

export default Badges;

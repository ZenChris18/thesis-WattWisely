import React, { useState, useEffect } from "react";
import { FaLightbulb } from "react-icons/fa";

function DashboardCard03() {
  // List of energy-saving tips
  const tips = [
    "Turn off lights when not in use.",
    "Unplug devices when they're fully charged.",
    "Use energy-efficient LED bulbs.",
    "Adjust your thermostat to save energy.",
    "Wash clothes in cold water to save heating costs.",
    "Use natural sunlight instead of artificial lighting during the day.",
    "Seal doors and windows to prevent heat loss.",
    "Turn off electronics instead of leaving them on standby mode.",
    "Use a power strip to easily switch off multiple devices.",
    "Limit the use of space heaters—they consume a lot of electricity."
  ];

  // State to store 3 random tips
  const [currentTips, setCurrentTips] = useState([]);

  // Function to get 3 unique random tips
  const getRandomTips = () => {
    const shuffled = [...tips].sort(() => 0.5 - Math.random()); // Shuffle the array
    return shuffled.slice(0, 3); // Pick the first 3
  };

  // Update tips every 30 seconds
  useEffect(() => {
    setCurrentTips(getRandomTips()); // Set initial tips

    const interval = setInterval(() => {
      setCurrentTips(getRandomTips());
    }, 30000); // Change tips every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5">
      <header className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Energy-Saving Tips
        </h2>
      </header>
      
      <div className="flex items-center mb-4">
        <FaLightbulb className="text-yellow-500 text-3xl mr-2" />
        <span className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase">
          Random Tips
        </span>
      </div>

      {/* Display 3 tips */}
      <ul className="list-disc pl-5 space-y-3">
        {currentTips.map((tip, index) => (
          <li key={index} className="text-lg text-gray-700 dark:text-gray-300">
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DashboardCard03;

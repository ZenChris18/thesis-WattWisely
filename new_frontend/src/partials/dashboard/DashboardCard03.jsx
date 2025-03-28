import React, { useState, useEffect } from "react";
import { FaLightbulb } from "react-icons/fa";

function DashboardCard03() {
  const tips = [
    "Turn off lights and appliances when not in use.",
    "Unplug chargers and gadgets once the battery is full.",
    "Use LED bulbs—they last longer and consume less electricity.",
    "Electric fans use less power than air conditioners—use them when possible.",
    "Clean electric fan blades and aircon filters regularly for better efficiency.",
    "Avoid frequently opening and closing the refrigerator to keep the cold air inside.",
    "Place refrigerators in a cool spot—away from heat sources or direct sunlight.",
    "Turn off the TV or radio if no one is watching or listening.",
    "Avoid overloading extension cords to prevent overheating and power waste.",
    "Iron clothes in batches instead of one at a time to save energy.",
    "Do full loads of laundry instead of washing small batches frequently.",
    "Turn off electric fans when no one is in the room.",
    "Using a stovetop kettle instead of an electric kettle can save electricity, especially if you boil water often.",
    "Cook rice in a rice cooker right before mealtime to avoid keeping it in 'warm' mode for too long.",
    "Defrost your freezer regularly to maintain efficiency and reduce energy consumption.",
    "If using an air conditioner with Low/High settings, set it to Low when the room is already cool.",
    "Use a thermos to store hot water instead of repeatedly boiling water with an electric kettle.",
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

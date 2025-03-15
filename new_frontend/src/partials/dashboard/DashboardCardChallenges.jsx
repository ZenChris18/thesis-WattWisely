import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function DashboardCardChallenges({ showAll = false }) {
  // Sample challenges (replace with real data)
  const allChallenges = [
    { id: 1, title: "Reduce energy use by 5%", progress: 50, completed: false },
    { id: 2, title: "Turn off unused lights", progress: 100, completed: true },
    { id: 3, title: "Unplug unused devices", progress: 25, completed: false },
    { id: 4, title: "Use energy-efficient appliances", progress: 75, completed: false },
    { id: 5, title: "Limit AC use to 5 hours a day", progress: 40, completed: false },
  ];

  // Show either all challenges or only a few (for the dashboard)
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    if (showAll) {
      setChallenges(allChallenges); // Show everything (for Challenges Page)
    } else {
      setChallenges(allChallenges.slice(0, 3)); // Show 3 random (for Dashboard)
    }
  }, [showAll]);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-md rounded-xl p-5">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        🎯 Active Challenges
      </h2>

      {/* Challenges List */}
      <ul>
        {challenges.map((challenge) => (
          <li key={challenge.id} className="mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                {challenge.title}
              </span>
              
              {/* Status Badge */}
              {challenge.completed ? (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                  ✅ Completed
                </span>
              ) : (
                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                  ⏳ Ongoing
                </span>
              )}
            </div>

            {/* Progress Bar with Gradient Effect */}
            <div className="w-full bg-gray-200 rounded-full h-3 mt-2 relative">
              <div
                className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${challenge.progress}%` }}
              ></div>
            </div>
          </li>
        ))}
      </ul>

      {/* Show "See All" only on Dashboard */}
      {!showAll && (
        <div className="mt-4 text-center">
          <Link
            to="/challenges"
            className="text-sm text-blue-600 font-semibold hover:underline"
          >
            See All Challenges →
          </Link>
        </div>
      )}
    </div>
  );
}

export default DashboardCardChallenges;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchChallenges, completeChallenge, fetchPowerData } from "../../services/powerDataService";

function DashboardCardChallenges({ showAll = false }) {
  const [challenges, setChallenges] = useState([]);
  const [expandedChallenge, setExpandedChallenge] = useState(null);
  const [savedEnergy, setSavedEnergy] = useState(0);

  useEffect(() => {
    const loadChallenges = async () => {
      const challengeData = await fetchChallenges();
      setChallenges(showAll ? challengeData : challengeData.slice(0, 3));
      loadPowerDataAndCheckChallenges(challengeData);
    };

    const loadPowerDataAndCheckChallenges = async (loadedChallenges) => {
      const powerData = await fetchPowerData("-1d"); // Get yesterday's data

      if (powerData?.current && powerData?.previous) {
        const saved = powerData.previous.energy_kwh - powerData.current.energy_kwh;
        setSavedEnergy(saved);

        let updated = false;

        const completionPromises = loadedChallenges.map(async (challenge) => {
          if (!challenge.status && saved >= challenge.requirement_kwh) {
            const success = await completeChallenge(challenge.id);
            if (success) updated = true;
          }
        });

        await Promise.all(completionPromises);

        if (updated) {
          loadChallenges();
        }
      }
    };

    loadChallenges();

    const interval = setInterval(() => loadChallenges(), 60000);
    return () => clearInterval(interval);
  }, [showAll]);

  const toggleDescription = (challengeId) => {
    setExpandedChallenge(expandedChallenge === challengeId ? null : challengeId);
  };

  const formatDateToPHT = (utcDate) => {
    if (!utcDate) return "Not completed";

    return new Date(utcDate).toLocaleString("en-US", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // Uses AM/PM format
    });
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        🎯 Daily Challenges
      </h2>
      <ul>
        {challenges.map((challenge) => {
          const meetsRequirement = savedEnergy >= challenge.requirement_kwh;
          const progress = challenge.status
            ? 100
            : Math.min((savedEnergy / challenge.requirement_kwh) * 100, 100);

          return (
            <li
              key={challenge.id}
              className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm cursor-pointer transition-transform transform hover:scale-105"
              onClick={() => toggleDescription(challenge.id)}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {challenge.title}
                </span>

                {challenge.status ? (
                  <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                    ✅ Completed
                  </span>
                ) : meetsRequirement ? (
                  <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full">
                    🏆 Auto-Completed
                  </span>
                ) : (
                  <span className="bg-gray-400 text-white text-xs px-3 py-1 rounded-full">
                    ⏳ In Progress
                  </span>
                )}
              </div>

              {expandedChallenge === challenge.id && (
                <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                  {challenge.description}
                </p>
              )}

              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {challenge.status
                  ? `Completed on: ${formatDateToPHT(challenge.date_completed)}`
                  : `Required: ${challenge.requirement_kwh} kWh`}
              </p>

              <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-3 mt-3 relative">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: challenge.status
                      ? "#10B981"
                      : meetsRequirement
                      ? "#F59E0B"
                      : "#3B82F6",
                  }}
                ></div>
              </div>
            </li>
          );
        })}
      </ul>

      {!showAll && (
        <div className="mt-4 text-center">
          <Link to="/challenges" className="text-sm text-blue-600 font-semibold hover:underline">
            See All Challenges →
          </Link>
        </div>
      )}
    </div>
  );
}

export default DashboardCardChallenges;

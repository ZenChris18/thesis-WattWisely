import React, { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import Progbar from "../components/Progbar";

function AchievementPage() {
  const [isAchievementComplete, setIsAchievementComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPowerConsumption() {
      try {
        const response = await fetch("/powerData.json");
        const data = await response.json();

        const history = data.history;
        const startDate = new Date(data.start_date);

        if (history.length === 0) {
          console.warn("No data available.");
          setLoading(false);
          return;
        }

        // Filter records from the start date to current date
        const filteredHistory = history.filter(
          (entry) => new Date(entry.date) >= startDate
        );

        if (filteredHistory.length < 2) {
          console.warn("Not enough data for meaningful comparison.");
          setLoading(false);
          return;
        }

        // Get first and last recorded consumption
        const startConsumption = filteredHistory[0].consumption;
        const currentConsumption = filteredHistory[filteredHistory.length - 1].consumption;

        // Check if there is a decrease in power consumption over time
        setIsAchievementComplete(currentConsumption < startConsumption);
      } catch (error) {
        console.error("Error fetching power data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPowerConsumption();
  }, []);

  return (
    <MainLayout>
      <h1>Achievements</h1>
      {loading ? (
        <p>Loading achievements...</p>
      ) : (
        <ul className="list-disc pl-5">
          <li className="text-lg">
            Save power lower than yesterday{" "}
            {isAchievementComplete ? "✅" : "❌"}
          </li>
        </ul>
      )}
      <Progbar />
    </MainLayout>
  );
}

export default AchievementPage;

import React, { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import Progbar from "../components/Progbar";

const allAchievements = [
  "The Journey Begins",
  "Wattling",
  "Wattdawan",
  "Watt Knight",
  "Watt Master",
  "Grand Master of Watts",
  "Megawatt Master"
];

function AchievementPage() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAchievements() {
      try {
        const powerResponse = await fetch("/powerData.json");
        const powerData = await powerResponse.json();
        const history = powerData.history;

        if (history.length < 2) {
          console.warn("Not enough data for comparison.");
          setLoading(false);
          return;
        }

        const achievementResponse = await fetch("/completedAchievements.json");
        const completedData = await achievementResponse.json();
        let completedAchievements = completedData.completed;

        let totalSavings = 0;
        const newAchievements = [];
        
        // Compares the current day's consumption (history[i]) with the previous day's consumption (history[i - 1])
        for (let i = 1; i < history.length; i++) {
          const todayConsumption = history[i].consumption;
          const yesterdayConsumption = history[i - 1].consumption;
          const saved = yesterdayConsumption - todayConsumption;
          totalSavings += saved;
        
        // Saved represents the difference between yesterday's consumption and today's consumption (yesterdayConsumption - todayConsumption)
          if (!completedAchievements.includes("Wattling") && saved > 0) {
            newAchievements.push("Wattling");
          }
          if (!completedAchievements.includes("Wattdawan") && saved > 50) {
            newAchievements.push("Wattdawan");
          }
          if (!completedAchievements.includes("Watt Knight") && saved > 100) {
            newAchievements.push("Watt Knight");
          }
          if (!completedAchievements.includes("Watt Master") && saved > 150) {
            newAchievements.push("Watt Master");
          }
          if (!completedAchievements.includes("Grand Master of Watts") && saved > 200) {
            newAchievements.push("Grand Master of Watts");
          }
          if (!completedAchievements.includes("Megawatt Master") && totalSavings > 250) {
            newAchievements.push("Megawatt Master");
          }
        }

        if (!completedAchievements.includes("The Journey Begins")) {
          newAchievements.push("The Journey Begins");
        }

        // Cant save the completed achievements
        if (newAchievements.length > 0) {
          completedAchievements = [...completedAchievements, ...newAchievements];

          await fetch("/completedAchievements.json", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: completedAchievements }),
          });
        }

        setAchievements(completedAchievements);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    checkAchievements();
  }, []);

  return (
    <MainLayout>
      <h1>Achievements</h1>
      {loading ? (
        <p>Loading achievements...</p>
      ) : (
        <ul className="list-disc pl-5">
          {allAchievements.map((ach, index) => (
            <li
              key={index}
              className={`text-lg ${
                achievements.includes(ach) ? "text-green-500 font-bold" : "text-gray-500"
              }`}
            >
              {achievements.includes(ach) ? "✅" : "❌"} {ach}
            </li>
          ))}
        </ul>
      )}
    </MainLayout>
  );
}

export default AchievementPage;

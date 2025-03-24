import React, { useState, useEffect } from "react";
import { fetchPowerData } from "../../services/powerDataService";

function DashboardCard02({ selectedTimeframe, selectedAppliance }) {
  const [energyUsage, setEnergyUsage] = useState(0);
  const [previousEnergy, setPreviousEnergy] = useState(0);
  const [loading, setLoading] = useState(true);

  const timeframeMapping = {
    "Past Hour": "-1h",
    "Past Day": "-1d",
    "Past Week": "-1w",
  };

  useEffect(() => {
    const getPowerData = async () => {
      setLoading(true);
      const apiTimeframe = timeframeMapping[selectedTimeframe] || "-1h";
      const data = await fetchPowerData(apiTimeframe);
      if (!data) return;

      let newEnergyUsage = 0;
      let newPreviousEnergy = 0;

      if (selectedAppliance && selectedAppliance.id !== "overall") {
        // ✅ Get energy data directly from the selected appliance
        const selectedDevice = data.appliances?.find(appliance => appliance.entity_id === selectedAppliance.id);
        if (selectedDevice) {
          newEnergyUsage = selectedDevice.current?.energy_kwh || 0;
          newPreviousEnergy = selectedDevice.previous?.energy_kwh || 0;
        }
      } else {
        // ✅ Use overall energy_kwh values
        newEnergyUsage = data.current?.energy_kwh || 0;
        newPreviousEnergy = data.previous?.energy_kwh || 0;
      }

      setEnergyUsage(newEnergyUsage);
      setPreviousEnergy(newPreviousEnergy);
      setLoading(false);
    };

    getPowerData();
    const interval = setInterval(getPowerData, 30000);
    return () => clearInterval(interval);
  }, [selectedTimeframe, selectedAppliance]);

  // Determine trend text
  let trendText = "";
  if (!loading) {
    if (energyUsage > previousEnergy) {
      trendText = "You're using more energy. Try turning off unnecessary devices!";
    } else if (energyUsage < previousEnergy) {
      trendText = "Great job! Your energy usage is lower than before!";
    } else {
      trendText = "Your energy usage remains the same.";
    }
  }

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5">
      <div>
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Energy Usage
          </h2>
        </header>

        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">
          Energy Consumption ({selectedTimeframe})
        </div>

        <div className="flex items-center space-x-3">
          {/* Energy Icon */}
          <div className="p-2 bg-blue-500/20 rounded-full">
            <svg
              className="w-6 h-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>

          {/* Energy Value */}
          {loading ? (
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Loading...
            </div>
          ) : (
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {energyUsage.toFixed(4)} kWh
            </div>
          )}
        </div>

        {/* Trend Indicator */}
        {!loading && (
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
            {energyUsage > previousEnergy ? (
              <span className="text-red-500">▲ Increased</span>
            ) : energyUsage < previousEnergy ? (
              <span className="text-green-500">▼ Decreased</span>
            ) : (
              <span className="text-gray-500">No change</span>
            )}
          </div>
        )}

        {/* Additional Advice Text */}
        {!loading && (
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            {trendText}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardCard02;

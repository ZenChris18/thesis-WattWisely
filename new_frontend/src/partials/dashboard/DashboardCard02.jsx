import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EditMenu from "../../components/DropdownEditMenu";
import { fetchPowerData } from "../../services/powerDataService";

function DashboardCard02({ selectedTimeframe }) {
  const [powerData, setPowerData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Convert user-friendly timeframe to API-compatible format
  const timeframeMapping = {
    "Past Hour": "-1h",
    "Past Day": "-1d",
    "Past Week": "-1w",
  };

  useEffect(() => {
    const getPowerData = async () => {
      setLoading(true);
      const apiTimeframe = timeframeMapping[selectedTimeframe] || "-1h"; // Default to 1 hour if undefined
      const data = await fetchPowerData(apiTimeframe);
      setPowerData(data);
      setLoading(false);
    };

    getPowerData();

    // Poll for updates every 30 seconds
    const interval = setInterval(getPowerData, 30000);
    return () => clearInterval(interval);
  }, [selectedTimeframe]);

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
              {powerData?.current?.energy_kwh.toFixed(4) || "0.0000"} kWh
            </div>
          )}
        </div>

        {/* Trend Indicator */}
        {!loading && powerData?.previous?.energy_kwh !== undefined && (
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
            {powerData.current.energy_kwh > powerData.previous.energy_kwh ? (
              <span className="text-green-500">▲ Increased</span>
            ) : powerData.current.energy_kwh < powerData.previous.energy_kwh ? (
              <span className="text-red-500">▼ Decreased</span>
            ) : (
              <span className="text-gray-500">No change</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardCard02;

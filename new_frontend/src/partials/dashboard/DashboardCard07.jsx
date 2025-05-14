import React, { useState, useEffect } from "react";
import { fetchPowerData } from "../../services/powerDataService";

function DashboardCard07({ selectedTimeframe, selectedAppliance }) {
  const [currentEnergy, setCurrentEnergy] = useState(null);
  const [previousEnergy, setPreviousEnergy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Energy Cost Comparison");
  const [rate, setRate] = useState(() => {
    const savedRate = localStorage.getItem('meralcoRate');
    return savedRate ? parseFloat(savedRate) : 10.0;
  });
  const [inputValue, setInputValue] = useState(rate.toString());

  // Meralco rate information (as of 2023)
  const meralcoRates = {
    typicalRange: "₱8.00 - ₱15.00",
    currentRate: "₱10.45",
    explanation: "Meralco rates vary monthly based on generation charges, with residential rates typically between ₱8-₱15 per kWh."
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!selectedTimeframe) return;

      const timeframeMap = {
        "Past Hour": "-1h",
        "Past Day": "-1d",
        "Past Week": "-1w",
      };
      const timeframeParam = timeframeMap[selectedTimeframe] || "-1h";

      try {
        const data = await fetchPowerData(timeframeParam, selectedAppliance.id === "overall" ? "all" : selectedAppliance.id);
        
        if (selectedAppliance.id === "overall") {
          setCurrentEnergy(data?.current?.energy_kwh);
          setPreviousEnergy(data?.previous?.energy_kwh);
          setTitle("Total Energy Cost Comparison");
        } else {
          const applianceData = data.appliances?.find(a => a.entity_id === selectedAppliance.id);
          setCurrentEnergy(applianceData?.current?.energy_kwh);
          setPreviousEnergy(applianceData?.previous?.energy_kwh);
          setTitle(`${selectedAppliance.name} Energy Cost`);
        }
      } catch (error) {
        console.error("Error loading power data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [selectedTimeframe, selectedAppliance]);

  const handleRateChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (/^\d*\.?\d*$/.test(value)) {
      const newRate = parseFloat(value);
      if (!isNaN(newRate)) {
        setRate(newRate);
        localStorage.setItem('meralcoRate', newRate);
      }
    }
  };

  const handleBlur = () => {
    if (inputValue === "" || isNaN(parseFloat(inputValue))) {
      const defaultRate = 10.45; // Set to current Meralco rate
      setInputValue(defaultRate.toFixed(2));
      setRate(defaultRate);
      localStorage.setItem('meralcoRate', defaultRate);
    } else {
      const formattedValue = parseFloat(inputValue).toFixed(2);
      setInputValue(formattedValue);
      setRate(parseFloat(formattedValue));
    }
  };

  const calculateCost = (energy) => (energy * rate).toFixed(2);

  return (
    <div className="col-span-12 bg-white dark:bg-gray-800 shadow-lg rounded-sm border border-gray-200 dark:border-gray-700">
      <div className="px-5 py-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </h2>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Electricity cost comparison using custom rate
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-md">
            <p className="text-xs text-blue-600 dark:text-blue-300">
              <span className="font-medium">Typical Meralco rates:</span> {meralcoRates.typicalRange} 
              <span className="ml-2">(Current: {meralcoRates.currentRate}/kWh)</span>
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Custom Electricity Rate (₱/kWh)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={handleRateChange}
                onBlur={handleBlur}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter rate"
              />
              <button 
                onClick={() => {
                  setInputValue("10.45");
                  setRate(10.45);
                  localStorage.setItem('meralcoRate', 10.45);
                }}
                className="whitespace-nowrap px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition"
              >
                Use Current Rate
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {meralcoRates.explanation}
            </p>
          </div>
          
          <div className="w-full sm:w-1/2 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cost Summary</h3>
            {loading ? (
              <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Current Cost</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    ₱{calculateCost(currentEnergy || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Previous Cost</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ₱{calculateCost(previousEnergy || 0)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Current Period</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Energy Used:</span>
                  <span className="font-medium">{(currentEnergy || 0).toFixed(3)} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Rate:</span>
                  <span className="font-medium">₱{rate.toFixed(2)}/kWh</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  <span className="text-gray-800 dark:text-gray-200 font-medium">Total Cost:</span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    ₱{calculateCost(currentEnergy || 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Previous Period</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Energy Used:</span>
                  <span className="font-medium">{(previousEnergy || 0).toFixed(3)} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Rate:</span>
                  <span className="font-medium">₱{rate.toFixed(2)}/kWh</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  <span className="text-gray-800 dark:text-gray-200 font-medium">Total Cost:</span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    ₱{calculateCost(previousEnergy || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardCard07;
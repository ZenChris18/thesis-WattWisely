import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { fetchPowerData } from "../../services/powerDataService";

function DashboardCard05({ selectedTimeframe, selectedAppliance }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Power Usage Change (Now vs. Before)");
  const [percentageChange, setPercentageChange] = useState(null);

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

      const data = await fetchPowerData(timeframeParam);
      if (!data) return;

      let newChartData = [];
      let newTitle = "Power Usage Change (Now vs. Before)";
      let changePercentage = null;

      if (selectedAppliance && selectedAppliance.id !== "overall") {
        const applianceData = data.appliances?.find(appliance => appliance.entity_id === selectedAppliance.id);
        if (applianceData) {
          const currentPower = applianceData.current?.average_power_w || 0;
          const previousPower = applianceData.previous?.average_power_w || 0;

          newChartData = [
            { name: "Previous", power: previousPower },
            { name: "Current", power: currentPower },
          ];
          newTitle = `Power Usage: ${selectedAppliance.name || "Appliance"}`;
          changePercentage = previousPower ? ((currentPower - previousPower) / previousPower) * 100 : 0;
        }
      } else {
        const totalCurrentPower = data.appliances?.reduce((sum, appliance) => sum + (appliance.current?.average_power_w || 0), 0) || 0;
        const totalPreviousPower = data.appliances?.reduce((sum, appliance) => sum + (appliance.previous?.average_power_w || 0), 0) || 0;

        newChartData = [
          { name: "Previous", power: totalPreviousPower },
          { name: "Current", power: totalCurrentPower },
        ];
        newTitle = "Total Power Usage (Now vs. Before)";
        changePercentage = totalPreviousPower ? ((totalCurrentPower - totalPreviousPower) / totalPreviousPower) * 100 : 0;
      }

      setChartData(newChartData);
      setTitle(newTitle);
      setPercentageChange(changePercentage);
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [selectedTimeframe, selectedAppliance]);

  const maxPower = Math.max(...chartData.map(item => item.power), 0);
  const yAxisMax = maxPower > 0 ? Math.ceil(maxPower * 1.2) : 10; // Ensures a rounded max value
  const yAxisDomain = [0, yAxisMax];

  return (
    <div className="col-span-12 sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-lg rounded-sm border border-gray-200 dark:border-gray-700">
      <div className="px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          A comparison of power consumption between the latest recorded data and the previous period
        </p>
        {percentageChange !== null && (
          <p className={`text-sm font-semibold ${percentageChange >= 0 ? "text-red-500" : "text-green-500"}`}>
            {percentageChange >= 0 ? "▲" : "▼"} {Math.abs(percentageChange).toFixed(2)}%
          </p>
        )}
      </div>

      <div className="grow max-h-[300px] xl:max-h-[300px]">
        {!loading ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis domain={yAxisDomain} />
              <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff", borderRadius: "5px" }} />
              <Bar dataKey="power" fill="#6366F1" barSize={50} radius={[5, 5, 0, 0]}>
                <LabelList dataKey="power" position="top" fill="#fff" fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">Loading data...</p>
        )}
      </div>
    </div>
  );
}

export default DashboardCard05;

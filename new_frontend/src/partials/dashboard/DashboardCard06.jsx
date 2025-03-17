import React, { useState, useEffect } from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from "recharts";
import { fetchPowerData, fetchApplianceNames } from "../../services/powerDataService";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6666"];

function DashboardCard06({ selectedTimeframe }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applianceNames, setApplianceNames] = useState({});

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

      const [data, names] = await Promise.all([fetchPowerData(timeframeParam), fetchApplianceNames()]);
      if (!data) return;
      setApplianceNames(names);

      const totalPower = data.appliances?.reduce((sum, appliance) => sum + (appliance.current?.average_power_w || 0), 0) || 1;
      
      const newChartData = data.appliances?.map(appliance => ({
        name: names[appliance.entity_id] || appliance.entity_id,
        value: ((appliance.current?.average_power_w || 0) / totalPower) * 100,
        watts: appliance.current?.average_power_w || 0,
      })) || [];
      
      setChartData(newChartData);
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [selectedTimeframe]);

  return (
    <div className="col-span-12 sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-lg rounded-sm border border-gray-200 dark:border-gray-700">
      <div className="px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Appliance Power Breakdown</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Percentage share of power consumption per appliance</p>
      </div>

      <div className="grow max-h-[300px] xl:max-h-[300px]">
        {!loading ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${value.toFixed(2)}%`}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, _, props) => [`${props.payload.watts.toFixed(2)} W`, props.payload.name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">Loading data...</p>
        )}
      </div>
    </div>
  );
}

export default DashboardCard06;
import React, { useState, useEffect } from 'react';
import PowerLineChart from '../../charts/PowerLineChart';
import { fetchPowerData } from '../../services/powerDataService';

function DashboardCard01({ selectedTimeframe, selectedAppliance }) {
  const [chartData, setChartData] = useState([]);
  const [totalConsumption, setTotalConsumption] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedTimeframe) return;

      const timeframeMap = {
        'Past Hour': '-1h',
        'Past Day': '-1d',
        'Past Week': '-1w',
      };

      const timeframeParam = timeframeMap[selectedTimeframe] || '-1h';

      const data = await fetchPowerData(timeframeParam);
      if (!data) return;

      let newChartData = [];
      let displayedConsumption = 0; // Number displayed at the top

      if (selectedAppliance && selectedAppliance.id !== "overall") {
        // ✅ Specific device: Get its own power_w values
        const selectedData = data.appliances?.find(appliance => appliance.entity_id === selectedAppliance.id);
        
        if (selectedData) {
          displayedConsumption = selectedData.data?.reduce((acc, entry) => acc + entry.power_w, 0) || 0;
          newChartData = selectedData.data?.map((entry) => ({
            time: entry.time,
            value: entry.power_w,
          })).reverse() || [];
        }
      } else {
        // ✅ "Overall": Sum up all appliances' power_w and use total_power_w for display
        const combinedData = {};

        data.appliances?.forEach(appliance => {
          appliance.data.forEach(entry => {
            if (!combinedData[entry.time]) {
              combinedData[entry.time] = 0;
            }
            combinedData[entry.time] += entry.power_w;
          });
        });

        newChartData = Object.entries(combinedData)
          .map(([time, value]) => ({ time, value }))
          .sort((a, b) => new Date(a.time) - new Date(b.time)); // Ensure correct order
        
        displayedConsumption = data.current?.total_power_w || 0; // ✅ Show total power for "Overall"
      }

      setTotalConsumption(displayedConsumption);
      setChartData(newChartData);
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [selectedTimeframe, selectedAppliance]);

  return (
    <div className="col-span-12 sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-lg rounded-sm border border-gray-200 dark:border-gray-700">
      <div className="px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Power Consumption</h2>
        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
          {totalConsumption.toLocaleString()} W
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Total usage in {selectedTimeframe}</p>
      </div>

      <div className="grow max-h-[300px] xl:max-h-[300px]">
        <PowerLineChart data={chartData} selectedTimeframe={selectedTimeframe} />
      </div>
    </div>
  );
}

export default DashboardCard01;

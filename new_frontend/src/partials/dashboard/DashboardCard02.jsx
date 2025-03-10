import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LineChart from '../../charts/LineChart01';
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import EditMenu from '../../components/DropdownEditMenu';
import { fetchPowerData } from '../../services/powerDataService';

// Import utilities
import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';

function DashboardCard02() {
  const [powerData, setPowerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPowerData = async () => {
      const data = await fetchPowerData();
      setPowerData(data);
      setLoading(false);
    };
    
    getPowerData();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(getPowerData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Prepare sample chart data
  const chartData = {
    labels: [
      '12-01-2022', '01-01-2023', /* ...other dates... */
    ],
    datasets: [
      // Blue line
      {
        data: [622, 504, /* ...other data points... */],
        fill: true,
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          return chartAreaGradient(ctx, chartArea, [
            { stop: 0, color: adjustColorOpacity(getCssVariable('--color-blue-500'), 0) },
            { stop: 1, color: adjustColorOpacity(getCssVariable('--color-blue-500'), 0.2) }
          ]);
        },
        borderColor: getCssVariable('--color-blue-500'),
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: getCssVariable('--color-blue-500'),
        pointHoverBackgroundColor: getCssVariable('--color-blue-500'),
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
      // Gray line
      {
        data: [532, 532, /* ...other data points... */],
        borderColor: adjustColorOpacity(getCssVariable('--color-gray-500'), 0.25),
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: adjustColorOpacity(getCssVariable('--color-gray-500'), 0.25),
        pointHoverBackgroundColor: adjustColorOpacity(getCssVariable('--color-gray-500'), 0.25),
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Energy Usage</h2>
          <EditMenu align="right" className="relative inline-flex">
            <li>
              <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">
                View Details
              </Link>
            </li>
            <li>
              <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">
                Refresh
              </Link>
            </li>
          </EditMenu>
        </header>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">Energy Consumption</div>
        <div className="flex items-start">
          {loading ? (
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">Loading...</div>
          ) : (
            <>
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">
                {powerData?.current.energy_kwh.toFixed(4)} kWh
              </div>
              <div className="text-sm font-medium text-blue-700 px-1.5 bg-blue-500/20 rounded-full">
                Est. ${powerData?.current.cost_estimation.toFixed(2)}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="grow max-sm:max-h-[128px] xl:max-h-[128px]">
        <LineChart data={chartData} width={389} height={128} />
      </div>
    </div>
  );
}

export default DashboardCard02;
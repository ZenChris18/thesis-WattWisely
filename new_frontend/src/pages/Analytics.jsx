import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import DashboardCard01 from '../partials/dashboard/DashboardCard01';
import DashboardCard02 from '../partials/dashboard/DashboardCard02';
import DashboardCard03 from '../partials/dashboard/DashboardCard03';
import Banner from '../partials/Banner';
import { Edit2 } from 'lucide-react';
import { fetchPowerData } from '../services/powerDataService';

function Analytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("Past Hour");
  const [dropdownOpen, setDropdownOpen] = useState({ timeframe: false, appliance: false });
  const [selectedAppliance, setSelectedAppliance] = useState(null);
  const [applianceNames, setApplianceNames] = useState(() => {
    return JSON.parse(localStorage.getItem("applianceNames")) || {};
  });

  const [appliances, setAppliances] = useState([
    { id: "choose", name: "Choose Appliance" },
    { id: "overall", name: "Overall" }
  ]);

  const timeframeDropdownRef = useRef(null);
  const applianceDropdownRef = useRef(null);

  // Mapping of user-friendly timeframes to API format
  const timeframeMapping = {
    "Past Hour": "-1h",
    "Past Day": "-1d",
    "Past Week": "-1w",
  };

  // Fetch appliances based on selected timeframe
  const loadAppliances = async () => {
    try {
      const formattedTimeframe = timeframeMapping[selectedTimeframe] || "-1h"; // Default to "-1h"
      const powerData = await fetchPowerData(formattedTimeframe);

      if (powerData?.appliances) {
        const fetchedAppliances = powerData.appliances.map((appliance, index) => ({
          id: appliance.entity_id,
          name: applianceNames[appliance.entity_id] || `Appliance ${index + 1}`,
        }));

        setAppliances([
          { id: "choose", name: "Choose Appliance" },
          { id: "overall", name: "Overall" },
          ...fetchedAppliances
        ]);
      }
    } catch (error) {
      console.error("Error fetching appliances:", error);
    }
  };

  useEffect(() => {
    loadAppliances();
  }, [selectedTimeframe]);  // ✅ Fetches data whenever timeframe changes

  useEffect(() => {
    localStorage.setItem("applianceNames", JSON.stringify(applianceNames));
  }, [applianceNames]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (timeframeDropdownRef.current && !timeframeDropdownRef.current.contains(event.target)) &&
        (applianceDropdownRef.current && !applianceDropdownRef.current.contains(event.target))
      ) {
        setDropdownOpen({ timeframe: false, appliance: false });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectTimeframe = (timeframe) => {
    setSelectedTimeframe(timeframe);
    setDropdownOpen((prev) => ({ ...prev, timeframe: false }));
  };

  const handleSelectAppliance = (appliance) => {
    if (appliance.id === "choose") return;
    setSelectedAppliance(appliance);
    setDropdownOpen((prev) => ({ ...prev, appliance: false }));
    setAppliances((prev) => prev.filter((item) => item.id !== "choose"));
  };

  const handleEditAppliance = (id) => {
    const newName = prompt("Enter new name for the appliance:", applianceNames[id] || "");
    if (newName) {
      setApplianceNames((prev) => ({ ...prev, [id]: newName }));
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Analytics</h1>
              <div className="flex gap-4">
                {/* Timeframe Dropdown */}
                <div className="relative" ref={timeframeDropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((prev) => ({ ...prev, timeframe: !prev.timeframe }))}
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    {selectedTimeframe}
                  </button>
                  {dropdownOpen.timeframe && (
                    <div className="absolute left-0 top-full mt-1 min-w-[150px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-10">
                      {Object.keys(timeframeMapping).map((timeframe) => (
                        <button
                          key={timeframe}
                          onClick={() => handleSelectTimeframe(timeframe)}
                          className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                          {timeframe}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Appliance Dropdown */}
                <div className="relative" ref={applianceDropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((prev) => ({ ...prev, appliance: !prev.appliance }))}
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    {selectedAppliance ? applianceNames[selectedAppliance.id] || selectedAppliance.name : "Choose Appliance"}
                  </button>
                  {dropdownOpen.appliance && (
                    <div className="absolute left-0 top-full mt-1 min-w-[200px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-10">
                      {appliances.map((appliance) => (
                        <div key={appliance.id} className="flex items-center justify-between px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                          <button
                            onClick={() => handleSelectAppliance(appliance)}
                            className="text-left w-full"
                          >
                            {applianceNames[appliance.id] || appliance.name}
                          </button>
                          {appliance.id !== "overall" && appliance.id !== "choose" && (
                            <Edit2 className="w-4 h-4 cursor-pointer" onClick={() => handleEditAppliance(appliance.id)} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <DashboardCard01 selectedTimeframe={selectedTimeframe} selectedAppliance={selectedAppliance} />
              <DashboardCard02 selectedTimeframe={selectedTimeframe} selectedAppliance={selectedAppliance} />
              <DashboardCard03 />
            </div>
          </div>
        </main>
        <Banner />
      </div>
    </div>
  );
}

export default Analytics;

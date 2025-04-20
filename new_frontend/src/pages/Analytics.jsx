import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import DashboardCard01 from '../partials/dashboard/DashboardCard01';
import DashboardCard02 from '../partials/dashboard/DashboardCard02';
import DashboardCard03 from '../partials/dashboard/DashboardCard03';
import DashboardCard05 from '../partials/dashboard/DashboardCard05';
import DashboardCard06 from '../partials/dashboard/DashboardCard06';
import { Edit2 } from 'lucide-react';
import { fetchPowerData, fetchApplianceNames, updateApplianceName, exportPowerPdf } from '../services/powerDataService';

function Analytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("Past Hour");
  const [dropdownOpen, setDropdownOpen] = useState({ timeframe: false, appliance: false });
  const [selectedAppliance, setSelectedAppliance] = useState(null);
  const [applianceNames, setApplianceNames] = useState(() => {
    return JSON.parse(localStorage.getItem("applianceNames")) || {};
  });

  const handleDownloadPdf = async () => {
    const tf = timeframeMapping[selectedTimeframe] || "-1h";
    const device = selectedAppliance?.id || "all";
    try {
      const blob = await exportPowerPdf(tf, device);
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = "power_report.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("PDF download error:", e);
    }
  };
  

  const [appliances, setAppliances] = useState([
    { id: "choose", name: "Choose Appliance" },
    { id: "overall", name: "Overall" }
  ]);

  const timeframeDropdownRef = useRef(null);
  const applianceDropdownRef = useRef(null);

  const timeframeMapping = {
    "Past Hour": "-1h",
    "Past Day": "-1d",
    "Past Week": "-1w",
  };

  const loadAppliances = async () => {
    try {
      const formattedTimeframe = timeframeMapping[selectedTimeframe] || "-1h";
      const powerData = await fetchPowerData(formattedTimeframe);
      const backendNames = await fetchApplianceNames();

      if (powerData?.appliances) {
        const fetchedAppliances = powerData.appliances.map((appliance, index) => ({
          id: appliance.entity_id,
          name: backendNames[appliance.entity_id] || `Appliance ${index + 1}`,
        }));

        setApplianceNames(backendNames);
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
  }, [selectedTimeframe]);

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
    setDropdownOpen({ timeframe: false, appliance: false });
  };

  const handleSelectAppliance = (appliance) => {
    if (appliance.id === "choose") return;
    setSelectedAppliance(appliance);
    setDropdownOpen({ timeframe: false, appliance: false });
    setAppliances((prev) => prev.filter((item) => item.id !== "choose"));
  };

  const handleEditAppliance = async (id) => {
    const newName = prompt("Enter new name for the appliance:", applianceNames[id] || "");
    if (newName) {
      const updatedName = await updateApplianceName(id, newName);
      if (updatedName) {
        setApplianceNames((prev) => ({ ...prev, [id]: updatedName }));
      }
    }
  };

  const toggleDropdown = (dropdown) => {
    setDropdownOpen((prev) => ({
      timeframe: dropdown === "timeframe" ? !prev.timeframe : false,
      appliance: dropdown === "appliance" ? !prev.appliance : false,
    }));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Sticky Buttons Section */}
        <div
          className={`sticky top-15 bg-white dark:bg-gray-900 py-3 shadow-md transition-all duration-300 ${
            sidebarOpen ? "z-10" : "z-29" /* change second z to 29 to be below the dropdown profile */
          }`}
        >
          <div className="flex gap-4 px-4 sm:px-6 lg:px-8">
            {/* Timeframe Dropdown */}
            <div className="relative" ref={timeframeDropdownRef}>
              <button
                onClick={() => toggleDropdown("timeframe")}
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
                onClick={() => toggleDropdown("appliance")}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                {selectedAppliance ? (applianceNames[selectedAppliance.id] || selectedAppliance.name) : "Choose Appliance"}
              </button>
              {dropdownOpen.appliance && (
                <div className="absolute top-full mt-1 min-w-[200px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-10 max-w-xs overflow-auto" style={{ maxHeight: "250px" }}>
                  {appliances.map((appliance) => (
                    <div key={appliance.id} className="flex items-center justify-between px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                      <button
                        onClick={() => handleSelectAppliance(appliance)}
                        className="text-left w-full truncate max-w-[150px]"
                        title={applianceNames[appliance.id] || appliance.name}
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
{/* Generate Reports Button */}
<button
  onClick={handleDownloadPdf}
  className="ml-auto bg-gradient-to-r from-purple-600 to-purple-500 text-white px-5 py-2 rounded-lg 
  font-semibold hover:from-purple-700 hover:to-purple-600 transition-all duration-300 
  shadow-lg hover:shadow-xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-600 
  focus:ring-opacity-50 flex items-center gap-2"
>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-5 w-5" 
    viewBox="0 0 20 20" 
    fill="currentColor"
  >
    <path 
      fillRule="evenodd" 
      d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" 
      clipRule="evenodd" 
    />
  </svg>
  Generate Reports
</button>
              </div>
            </div>

        <main className="grow px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-6">
            {/* Full-width DashboardCard01 */}
            <DashboardCard01 selectedTimeframe={selectedTimeframe} selectedAppliance={selectedAppliance} />

            {/* DashboardCard02 & DashboardCard03 side by side using grid-cols-12 */}
            <div className="grid grid-cols-12 gap-6">
              <DashboardCard02 selectedTimeframe={selectedTimeframe} selectedAppliance={selectedAppliance} className="col-span-6" />
              <DashboardCard03 className="col-span-6" />
              <DashboardCard03 className="col-span-6" /> {/* Placeholder for now change in the future with a new card*/}
            </div>

            {/* Power Usage Insights Section */}
            <div className="mt-8 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Power Usage Insights</h2>

              {/* Full-width DashboardCard05 */}
              <div className="pb-6">
                <DashboardCard05 selectedTimeframe={selectedTimeframe} selectedAppliance={selectedAppliance} />
              </div>

              {/* Full-width DashboardCard06 */}
              <DashboardCard06 selectedTimeframe={selectedTimeframe} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Analytics;

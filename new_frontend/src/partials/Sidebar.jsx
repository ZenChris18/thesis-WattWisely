import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";

import wattwiselyLogo from '../images/WattwiselyLogo.png';
import { usePoints } from "../contexts/PointsContext"; 
import { fetchUnlockedBadges } from "../services/powerDataService";

import { LogOut } from "lucide-react";

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  variant = 'default',
  wattpoints,
}) {
  const { totalPoints } = usePoints();
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === "true");
  
  // count the badges
  const [badgeCount, setBadgeCount] = useState(0);

  // Log out
  const handleLogout=()=>{
    localStorage.removeItem("usernameData");
  localStorage.removeItem("passwordData");
  window.location.href = "/tologin";
  }

  useEffect(() => {
    const getBadges = async () => {
      const unlockedBadges = await fetchUnlockedBadges();
      setBadgeCount(unlockedBadges.length);
    };

    getBadges();
  }, []);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <div className="min-w-fit">
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-gray-900/30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex lg:flex! flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:w-64! shrink-0 bg-white dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} ${variant === 'v2' ? 'border-r border-gray-200 dark:border-gray-700/60' : 'rounded-r-2xl shadow-xs'}`}
      >
      {/* Sidebar header */}
      <div className="flex justify-between items-center mb-10 pr-3 sm:px-2"> {/* Added items-center */}
        {/* Close button (unchanged) */}
        <button
          ref={trigger}
          className="lg:hidden text-gray-500 hover:text-gray-400"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
        >
          <span className="sr-only">Close sidebar</span>
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
          </svg>
        </button>
        
        {/* Logo - Updated */}
        <NavLink end to="/" className="block -my-2">
          <img 
            src={wattwiselyLogo} 
            alt="Wattwisely Logo" 
            className="h-20 w-auto object-scale-down"
          />
        </NavLink>
      </div>

        {/* Links */}
        <div className="space-y-8">
        {/* Pages group */}
        <div>
          <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
            <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
              •••
            </span>
            <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Pages</span>
          </h3>
          <ul className="mt-3">
            {/* Dashboard */}
            <li className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r ${pathname === "/" || pathname.includes("dashboard") ? "from-blue-300/[0.12] dark:from-blue-300/[0.24] to-blue-300/[0.04]" : "hover:bg-blue-500/[0.1] dark:hover:bg-blue-500/[0.1]"}`}>
              <NavLink
                end
                to="/"
                className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname === "/" || pathname.includes("dashboard") ? "" : "hover:text-gray-900 dark:hover:text-white"}`}
              >
                <div className="flex items-center">
                  <svg className={`shrink-0 fill-current ${pathname === "/" || pathname.includes("dashboard") ? "text-blue-500" : "text-gray-400 dark:text-gray-500"}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M5.936.278A7.983 7.983 0 0 1 8 0a8 8 0 1 1-8 8c0-.722.104-1.413.278-2.064a1 1 0 1 1 1.932.516A5.99 5.99 0 0 0 2 8a6 6 0 1 0 6-6c-.53 0-1.045.076-1.548.21A1 1 0 1 1 5.936.278Z" />
                    <path d="M6.068 7.482A2.003 2.003 0 0 0 8 10a2 2 0 1 0-.518-3.932L3.707 2.293a1 1 0 0 0-1.414 1.414l3.775 3.775Z" />
                  </svg>
                  <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                    Dashboard
                  </span>
                </div>
              </NavLink>
            </li>

            {/* Analytics & Stats */}
            <li className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r ${pathname.includes("analytics") ? "from-green-300/[0.12] dark:from-green-300/[0.24] to-green-300/[0.04]" : "hover:bg-green-500/[0.1] dark:hover:bg-green-500/[0.1]"}`}>
              <NavLink
                end
                to="/analytics"
                className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname.includes("analytics") ? "" : "hover:text-gray-900 dark:hover:text-white"}`}
              >
                <div className="flex items-center">
                  <svg className={`shrink-0 fill-current ${pathname.includes("analytics") ? "text-green-500" : "text-gray-400 dark:text-gray-500"}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M1 14h2V2H1v12Zm4 0h2V6H5v8Zm4 0h2V9H9v5Zm4 0h2V4h-2v10Z" />
                  </svg>
                  <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                    Analytics & Stats
                  </span>
                </div>
              </NavLink>
            </li>

            {/* Challenges */}
            <li className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r ${pathname.includes("challenges") ? "from-yellow-300/[0.12] dark:from-yellow-300/[0.24] to-yellow-300/[0.04]" : "hover:bg-yellow-500/[0.1] dark:hover:bg-yellow-500/[0.1]"}`}>
              <NavLink
                end
                to="/challenges"
                className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname.includes("challenges") ? "" : "hover:text-gray-900 dark:hover:text-white"}`}
              >
                <div className="flex items-center">
                  <svg className={`shrink-0 fill-current ${pathname.includes("challenges") ? "text-yellow-500" : "text-gray-400 dark:text-gray-500"}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M6.753 2.659a1 1 0 0 0-1.506-1.317L2.451 4.537l-.744-.744A1 1 0 1 0 .293 5.207l1.5 1.5a1 1 0 0 0 1.46-.048l3.5-4ZM6.753 10.659a1 1 0 1 0-1.506-1.317l-2.796 3.195-.744-.744a1 1 0 0 0-1.414 1.414l1.5 1.5a1 1 0 0 0 1.46-.049l3.5-4ZM8 4.5a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1ZM9 11.5a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z" />
                  </svg>
                  <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                    Challenges
                  </span>
                </div>
              </NavLink>
            </li>

            {/* Badges */}
            <li className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r ${pathname.includes("badges") ? "from-pink-300/[0.12] dark:from-pink-300/[0.24] to-pink-300/[0.04]" : "hover:bg-pink-500/[0.1] dark:hover:bg-pink-500/[0.1]"}`}>
              <NavLink
                end
                to="/badges"
                className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname.includes("badges") ? "" : "hover:text-gray-900 dark:hover:text-white"}`}
              >
                <div className="flex items-center">
                  <svg className={`shrink-0 fill-current ${pathname.includes("badges") ? "text-pink-500" : "text-gray-400 dark:text-gray-500"}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M8 0a4 4 0 0 1 4 4c0 1.282-.603 2.419-1.528 3.15l1.172 4.688a.5.5 0 0 1-.716.552L8 11.8l-2.928.59a.5.5 0 0 1-.716-.552l1.172-4.688A3.996 3.996 0 0 1 4 4a4 4 0 0 1 4-4Zm0 1a3 3 0 0 0-3 3c0 1.162.66 2.183 1.625 2.712a.5.5 0 0 1 .225.535l-.91 3.642 2.06-.414a.5.5 0 0 1 .197 0l2.06.414-.91-3.642a.5.5 0 0 1 .225-.535A3 3 0 0 0 11 4a3 3 0 0 0-3-3Zm-1 5.5a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" />
                  </svg>
                  <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                    Badges
                  </span>
                </div>
              </NavLink>
            </li>
          </ul>
        </div>
          {/* Points Section */}
          <div>
            <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Achievements</span>
            </h3>
            <ul className="mt-3">
              {/* Wattpoints */}
              <li className="pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150">
                <div className="flex items-center text-gray-800 dark:text-gray-100">
                  <svg className="shrink-0 fill-current text-yellow-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M7.5 1L1 9h5l-1 6 7-8H7l.5-6z" />
                  </svg>
                  <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                    Wattpoints: {totalPoints}
                  </span>
                </div>
              </li>

              {/* Badges */}
              <li className="pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150">
                <div className="flex items-center text-gray-800 dark:text-gray-100">
                  <svg className="shrink-0 fill-current text-indigo-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M8 0a4 4 0 0 1 4 4c0 1.282-.603 2.419-1.528 3.15l1.172 4.688a.5.5 0 0 1-.716.552L8 11.8l-2.928.59a.5.5 0 0 1-.716-.552l1.172-4.688A3.996 3.996 0 0 1 4 4a4 4 0 0 1 4-4Z" />
                  </svg>
                  <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                    Badges: {badgeCount}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/*Log Out*/}
        <div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>


        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="w-12 pl-4 pr-3 py-2">
            <button className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400" onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg className="shrink-0 fill-current text-gray-400 dark:text-gray-500 sidebar-expanded:rotate-180" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path d="M15 16a1 1 0 0 1-1-1V1a1 1 0 1 1 2 0v14a1 1 0 0 1-1 1ZM8.586 7H1a1 1 0 1 0 0 2h7.586l-2.793 2.793a1 1 0 1 0 1.414 1.414l4.5-4.5A.997.997 0 0 0 12 8.01M11.924 7.617a.997.997 0 0 0-.217-.324l-4.5-4.5a1 1 0 0 0-1.414 1.414L8.586 7M12 7.99a.996.996 0 0 0-.076-.373Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

import React from "react";
import Header from "../partials/Header";
import Sidebar from "../partials/Sidebar";
import DashboardCardChallenges from "../partials/dashboard/DashboardCardChallenges";

function Challenges() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mb-6">
              Challenges
            </h1>
            <DashboardCardChallenges showAll={true} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Challenges;

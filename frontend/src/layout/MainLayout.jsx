import React from "react";
import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <div className="layout-container">
      <Navbar />
      <div className="content">{children}</div>
    </div>
  );
}

export default MainLayout;

//import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";

import "./stylesheets/index.css";
import HomePage from "./pages/HomePage.jsx";
import GraphPage from "./pages/GraphPage.jsx";
import AchievementPage from "./pages/AchievementPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>
  },

  {
    path: "graph",
    element: <GraphPage/>
  },

  {
    path: "achieve",
    element: <AchievementPage/>
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);

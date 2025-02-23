import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../stylesheets/index.css";
import "../stylesheets/home.css";

const Home = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("dailyTasks")) || [];
    const lastReset = localStorage.getItem("lastReset");
    const today = new Date().setHours(0, 0, 0, 0);

    if (!lastReset || parseInt(lastReset) < today) {
      resetTasks();
    } else {
      setTasks(savedTasks);
    }
  }, []);

  const resetTasks = () => {
    const newTasks = Array(5).fill(0);
    setTasks(newTasks);
    localStorage.setItem("dailyTasks", JSON.stringify(newTasks));
    localStorage.setItem("lastReset", new Date().setHours(0, 0, 0, 0));
  };

  const completeTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = 100;
    setTasks(updatedTasks);
    localStorage.setItem("dailyTasks", JSON.stringify(updatedTasks));
  };

  return (
    <motion.div
      className="home-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      {/* Wrapper to align daily tasks and links properly */}
      <div className="content-wrapper">
        {/* Daily Tasks Section */}
        <div className="daily-tasks">
          <h2>Daily Tasks</h2>
          {tasks.map((progress, index) => (
            <div key={index} className="task">
              <p>Save Watts</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <button
                className="task-button"
                onClick={() => completeTask(index)}
                disabled={progress === 100}
              >
                {progress === 100 ? "Completed" : "Complete Task"}
              </button>
            </div>
          ))}
        </div>

        {/* Image Links Section */}
        <div className="image-links">
          {[
            { name: "Achievements", link: "/achieve" },
            { name: "How to Use", link: "/how-to-use" },
            { name: "Graphs", link: "/graph" },
          ].map((item, index) => (
            <motion.a
              key={index}
              href={item.link}
              className="image-box"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <p>{item.name}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
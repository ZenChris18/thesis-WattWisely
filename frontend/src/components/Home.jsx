import React, { useState, useEffect } from "react";
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
    <div className="home-container">
      <h1>Home Page</h1>

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

      <div className="image-links">
        {[
          {name: "Achievements", img: "achievements.jpg", link: "/achieve" },
          {name: "How to Use", img: "howtouse.jpg", link: "/how-to-use" },
          {name: "Graphs", img: "graphs.jpg", link: "/graph" },
        ].map((item, index) => (
          <a key={index} href={item.link} className="image-box">
            <p>{item.name}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Home;

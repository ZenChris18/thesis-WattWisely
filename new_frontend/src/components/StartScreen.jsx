import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiZap } from "react-icons/fi";

const StartScreen = ({ onFinish }) => {
  const [showText, setShowText] = useState(false);
  const [showClickToStart, setShowClickToStart] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showLightning, setShowLightning] = useState(true);

  useEffect(() => {
    setTimeout(() => setShowLightning(false), 2500); // Hide lightning after flicker
    setTimeout(() => setShowText(true), 2800); // Show text after lightning fades
    setTimeout(() => setShowClickToStart(true), 4500);
  }, []);

  const handleClick = () => {
    setFadeOut(true);
    setTimeout(onFinish, 1000);
  };

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-[#111827] text-white"
      initial={{ opacity: 1 }}
      animate={{ opacity: fadeOut ? 0 : 1, scale: fadeOut ? 1.1 : 1 }}
      transition={{ duration: 1 }}
      onClick={handleClick}
    >
      {showLightning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0.3, 1, 0.2, 1, 0],
          }}
          transition={{
            duration: 2.5,
            times: [0, 0.2, 0.4, 0.6, 0.75, 0.9, 1],
            ease: "easeInOut",
          }}
          className="absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[70%]"
        >
          <FiZap
            size={140}
            strokeWidth={1.5}
            className="text-yellow-400 drop-shadow-[0_0_25px_rgba(255,255,0,1)]"
            style={{ transform: "scaleX(0.8) scaleY(1.2) rotate(9deg)" }}
          />
        </motion.div>
      )}

      {showText && (
        <motion.div
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-10 text-center"
        >
          <h1 className="text-5xl font-bold text-white drop-shadow-[0_0_20px_rgba(255,255,255,1)]">
            Welcome to WattWisely
          </h1>
          <p className="text-xl mt-2 text-gray-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]">
            Monitoring & Saving Energy Made Easy
          </p>
        </motion.div>
      )}

      {showClickToStart && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-6 text-gray-300 text-lg animate-pulse"
        >
          Click to Start
        </motion.div>
      )}
    </motion.div>
  );
};

export default StartScreen;

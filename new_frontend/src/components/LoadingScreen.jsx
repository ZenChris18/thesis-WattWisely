import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiZap } from "react-icons/fi";

const LoadingScreen = () => {
  const [charge, setCharge] = useState(0);

  useEffect(() => {
    // Simulate battery charging
    const interval = setInterval(() => {
      setCharge((prev) => (prev < 100 ? prev + 10 : 100)); // Increase charge by 10% until 100%
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#111827] text-white">
      {/* Battery Container */}
      <div className="relative flex items-center">
        {/* Battery Body (Increased Size) */}
        <div className="relative w-40 h-20 border-4 border-white rounded-lg flex items-center overflow-hidden">
          {/* Battery Fill (Green Charging Bar) */}
          <motion.div
            className="h-full bg-green-500"
            style={{
              width: `${charge}%`, // Fill battery based on charge state
            }}
          />

          {/* Charging Bolt Icon (Pulsing Effect) */}
          {charge > 20 && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              <FiZap
                className="text-white text-4xl" // Increased icon size
                style={{
                  filter: "drop-shadow(0px 0px 5px yellow)", // Glow effect
                  WebkitTextStroke: "1px black",
                }}
              />
            </motion.div>
          )}
        </div>

        {/* Battery Tip (Now Bigger and Aligned) */}
        <div className="w-4 h-6 bg-white ml-[-2px]"></div>
      </div>

      {/* Blinking Charging Percentage Text */}
      <motion.p
        className="mt-6 text-2xl font-bold"
        animate={{ opacity: [1, 0.3, 1] }} // Slow blinking effect
        transition={{ repeat: Infinity, duration: 2}} // 2-second slow fade
      >
        Loading... {charge}%
      </motion.p>
    </div>
  );
};

export default LoadingScreen;

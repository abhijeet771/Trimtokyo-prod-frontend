import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./SplashScreen.scss";

const SplashScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let start = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const percentage = Math.min((elapsed / 2000) * 100, 100);
      setProgress(percentage);

      if (percentage === 100) {
        clearInterval(interval);

        // delay for smooth exit animation
        setTimeout(() => {
          setIsVisible(false);

          // wait for exit animation to complete
          setTimeout(() => {
            localStorage.setItem("splashShown", "true");
            onFinish();
          }, 500);
        }, 200);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="splash-container"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="splash-content">
            <motion.img
              src="/scissor.png"
              alt="logo"
              className="logo"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />

            <motion.h2
              className="welcome-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Welcome to TrimTokyo
            </motion.h2>

            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
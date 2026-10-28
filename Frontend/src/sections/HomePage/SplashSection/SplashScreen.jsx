
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./SplashScreen.scss";

const SPLASH_DURATION = 2400;
const EXIT_DURATION = 0.45;

const SplashScreen = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);
  const finishedRef = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsVisible(false);
    }, SPLASH_DURATION);

    return () => window.clearTimeout(timer);
  }, []);

  const handleExitComplete = () => {
    if (finishedRef.current) return;

    finishedRef.current = true;

    try {
      window.localStorage.setItem("splashShown", "true");
    } catch {
      // Continue even if browser storage is unavailable.
    }

    onFinish?.();
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isVisible && (
        <motion.div
          className="splash-screen"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.025,
            filter: "blur(8px)",
          }}
          transition={{
            duration: EXIT_DURATION,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          {/* Ambient background */}
          <div className="splash-screen__background">
            <div className="splash-screen__grid" />
            <div className="splash-screen__glow splash-screen__glow--left" />
            <div className="splash-screen__glow splash-screen__glow--right" />
            <div className="splash-screen__noise" />
          </div>

          {/* Center content */}
          <motion.main
            className="splash-screen__content"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Brand mark */}
            <motion.div
              className="splash-screen__logo-stage"
              initial={{ opacity: 0, scale: 0.72, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                delay: 0.12,
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <motion.div
                className="splash-screen__orbit splash-screen__orbit--outer"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              <motion.div
                className="splash-screen__orbit splash-screen__orbit--inner"
                animate={{ rotate: -360 }}
                transition={{
                  duration: 9,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              <div className="splash-screen__logo-halo" />

              <motion.img
                src="/scissor.png"
                alt="TrimTokyo"
                className="splash-screen__logo"
                draggable="false"
                animate={{
                  y: [0, -4, 0],
                  filter: [
                    "drop-shadow(0 0 12px rgba(48, 139, 255, 0.18))",
                    "drop-shadow(0 0 28px rgba(48, 139, 255, 0.48))",
                    "drop-shadow(0 0 12px rgba(48, 139, 255, 0.18))",
                  ],
                }}
                transition={{
                  y: {
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  filter: {
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              />

              <motion.div
                className="splash-screen__logo-sweep"
                initial={{ x: "-150%", opacity: 0 }}
                animate={{
                  x: ["-150%", "150%"],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  delay: 0.65,
                  duration: 1,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Brand name */}
            <motion.div
              className="splash-screen__brand"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.48,
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <h1 className="splash-screen__title">
                TRIM<span>TOKYO</span>
              </h1>

              <motion.div
                className="splash-screen__title-line"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  delay: 0.85,
                  duration: 0.65,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />

              <motion.p
                className="splash-screen__tagline"
                initial={{ opacity: 0, letterSpacing: "0.32em" }}
                animate={{ opacity: 1, letterSpacing: "0.2em" }}
                transition={{
                  delay: 0.95,
                  duration: 0.7,
                  ease: "easeOut",
                }}
              >
                PRECISION. STYLE. CONFIDENCE.
              </motion.p>
            </motion.div>

            {/* Loading indicator */}
            <motion.div
              className="splash-screen__loader"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.5 }}
            >
              <div
                className="splash-screen__progress-track"
                role="progressbar"
                aria-label="Loading"
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <motion.div
                  className="splash-screen__progress-fill"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: SPLASH_DURATION / 1000,
                    ease: "linear",
                  }}
                />
              </div>

              <div className="splash-screen__loader-footer">
                <span>CRAFTED FOR YOUR STYLE</span>
                <motion.span
                  className="splash-screen__loader-dot"
                  animate={{ opacity: [0.35, 1, 0.35] }}
                  transition={{
                    duration: 1.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  ●
                </motion.span>
              </div>
            </motion.div>
          </motion.main>

          {/* Decorative corner details */}
          <div className="splash-screen__corner splash-screen__corner--top" />
          <div className="splash-screen__corner splash-screen__corner--bottom" />

          <motion.span
            className="splash-screen__edition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            THE ART OF GROOMING
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;

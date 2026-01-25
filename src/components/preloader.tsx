"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";

export default function Preloader() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Counter Animation
    const duration = 2000; // 2 seconds to count
    const steps = 100;
    const intervalTime = duration / steps;

    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      exit="exit"
      className="fixed inset-0 z-[9999] bg-black text-white flex flex-col justify-between p-4 md:p-10 cursor-wait overflow-hidden"
    >
      {/* --- GRID CORNERS --- */}

      {/* Top Left: Coordinates */}
      <div className="absolute top-4 left-4 md:top-10 md:left-10 text-xs md:text-sm font-mono text-gray-400 tracking-widest uppercase">
        <div>30.2672° N</div>
        <div>97.7431° W</div>
      </div>

      {/* Top Right: Status */}
      <div className="absolute top-4 right-4 md:top-10 md:right-10 text-xs md:text-sm font-mono tracking-widest flex items-center gap-2 uppercase">
        <span className="w-2 h-2 bg-[#C6A848] rounded-full animate-pulse"></span>
        <span>SYSTEM_NORMAL</span>
      </div>

      {/* Bottom Left: Version */}
      <div className="absolute bottom-4 left-4 md:bottom-10 md:left-10 text-xs md:text-sm font-mono text-gray-500 tracking-widest uppercase">
        V.2025.1.0
      </div>

      {/* Bottom Right: Counter */}
      <div className="absolute bottom-4 right-4 md:bottom-10 md:right-10 text-4xl md:text-8xl font-black font-mono tracking-tighter text-[#C6A848]">
        {count}%
      </div>

      {/* --- CENTER MASSIVE TYPE --- */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none overflow-hidden gap-10">
        {/* Logo Container */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="w-48 md:w-64 h-48 md:h-64 relative"
        >
          {/* Background "Empty" Logo (White) */}
          <img
            src="/images/logo/FF_Logo_wht.svg"
            alt="FF Logo Background"
            className="absolute inset-0 w-full h-full object-contain opacity-30"
          />

          {/* Foreground "Filled" Logo (Revealed by clip-path) */}
          {/* Fill direction: Top to Bottom (as requested) */}
          {/* inset(top right bottom left) -> We trim the bottom to reveal from top */}
          <div
            className="absolute inset-0 w-full h-full transition-all duration-75 ease-linear"
            style={{ clipPath: `inset(0 0 ${100 - count}% 0)` }}
          >
            <img
              src="/images/logo/FF_Logo_gld.svg"
              alt="FF Logo Filled"
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", scale: 0.9 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          transition={{ duration: 1, ease: "circOut" }}
          className="relative"
        >
          <h1 className="text-2xl md:text-4xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 select-none">
            INITIALIZING...
          </h1>
          {/* Kinetic Ghost Effect */}
          <motion.h1
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 0.5, x: 5 }}
            transition={{
              duration: 0.1,
              repeat: Infinity,
              repeatType: "mirror",
            }}
            className="absolute top-0 left-0 w-full text-2xl md:text-4xl font-black tracking-[0.2em] text-[#C6A848] opacity-30 mix-blend-overlay blur-[2px] select-none"
          >
            INITIALIZING...
          </motion.h1>
        </motion.div>
      </div>

      {/* Decoration: Scanlines */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 mix-blend-overlay"></div>
    </motion.div>
  );
}

const containerVariants: Variants = {
  initial: {
    y: 0,
  },
  exit: {
    y: "-100%",
    transition: {
      duration: 0.8,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

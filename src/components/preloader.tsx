"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { agency } from "@/data/content";

export const PRELOADER_DURATION_MS = 1100;

export default function Preloader() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / PRELOADER_DURATION_MS);
      setCount(Math.round(progress * 100));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      exit="exit"
      role="status"
      aria-label="Loading Forae Factory"
      data-preloader
      className="fixed inset-0 z-[9999] bg-surface text-ink flex flex-col justify-between p-4 md:p-10 overflow-hidden"
    >
      {/* Top Left: Coordinates */}
      <div aria-hidden className="absolute top-4 left-4 md:top-10 md:left-10 text-xs md:text-sm font-mono text-muted tracking-widest uppercase">
        <div>30.2672° N</div>
        <div>97.7431° W</div>
      </div>

      {/* Top Right: Location */}
      <div aria-hidden className="absolute top-4 right-4 md:top-10 md:right-10 text-xs md:text-sm font-mono tracking-widest flex items-center gap-2 uppercase">
        <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
        <span>Austin, TX</span>
      </div>

      {/* Bottom Left: Founded */}
      <div aria-hidden className="absolute bottom-4 left-4 md:bottom-10 md:left-10 text-xs md:text-sm font-mono text-muted tracking-widest uppercase">
        Est. {agency.founded}
      </div>

      {/* Bottom Right: Counter */}
      <div aria-hidden className="absolute bottom-4 right-4 md:bottom-10 md:right-10 text-4xl md:text-8xl font-black font-mono tracking-tighter text-accent">
        {count}%
      </div>

      {/* Center: logo fills top to bottom as the counter runs */}
      <div aria-hidden className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none overflow-hidden gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-48 md:w-64 h-48 md:h-64 relative"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- tiny inline SVG, no optimization needed */}
          <img
            src="/images/logo/FF_Logo_wht.svg"
            alt=""
            className="absolute inset-0 w-full h-full object-contain opacity-30"
          />
          <div
            className="absolute inset-0 w-full h-full"
            style={{ clipPath: `inset(0 0 ${100 - count}% 0)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- tiny inline SVG, no optimization needed */}
            <img
              src="/images/logo/FF_Logo_gld.svg"
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", scale: 0.9 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          transition={{ duration: 0.6, ease: "circOut" }}
          className="text-2xl md:text-4xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 select-none uppercase"
        >
          {agency.tagline.replace(/\.$/, "")}
        </motion.div>
      </div>
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
      duration: 0.7,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

"use client";

import { motion } from "framer-motion";
import { projects } from "@/data/content";

// Extract unique client names
const CLIENTS = Array.from(new Set(projects.map((p) => p.client)));

function MarqueeItem({ text }: { text: string }) {
  return (
    <span
      className="text-4xl md:text-6xl font-black uppercase text-transparent stroke-text opacity-30 px-8 whitespace-nowrap"
      style={{ WebkitTextStroke: "1px rgba(255,255,255,0.5)" }}
    >
      {text}
    </span>
  );
}

export default function TrustedBySection() {
  return (
    <section className="w-full py-16 bg-portfolio-bg border-b border-white/5 overflow-hidden">
      <div className="flex">
        <motion.div
          className="flex items-center"
          animate={{ x: "-50%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 20,
          }}
        >
          {/* Repeat list twice for seamless loop */}
          {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => (
            <div
              key={i}
              className="flex items-center"
            >
              <MarqueeItem text={client} />
              <div className="w-4 h-4 rounded-full bg-accent/20 mx-4" />
            </div>
          ))}
        </motion.div>
        <motion.div
          className="flex items-center"
          animate={{ x: "-50%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 20,
          }}
        >
          {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => (
            <div
              key={`dup-${i}`}
              className="flex items-center"
            >
              <MarqueeItem text={client} />
              <div className="w-4 h-4 rounded-full bg-accent/20 mx-4" />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">
          Trusted by Market Leaders
        </p>
      </div>
    </section>
  );
}

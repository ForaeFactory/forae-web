"use client";

import Link from "next/link";
import { useStore } from "@/store/useStore";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion, motion } from "framer-motion";
import { SITE_DESCRIPTION } from "@/data/site";

const WORDS = ["Strategy", "DesignOps", "Narrative", "Production", "Innovation"];

export default function HeroSection() {
  const setActiveSection = useStore((state) => state.setActiveSection);
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 });
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    if (isInView) setActiveSection("home");
  }, [isInView, setActiveSection]);

  useEffect(() => {
    // Rotating word with a gold "curtain"; paused off screen and for reduced motion.
    if (prefersReducedMotion || !isInView) return;
    let swap: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setIsRevealing(true); // Cover
      swap = setTimeout(() => {
        setIndex((prev) => (prev + 1) % WORDS.length); // Change text while hidden
        setIsRevealing(false); // Reveal
      }, 500);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(swap);
    };
  }, [prefersReducedMotion, isInView]);

  return (
    <section
      id="home"
      ref={ref}
      aria-labelledby="hero-heading"
      className="min-h-screen w-full flex flex-col items-center justify-center relative pointer-events-none px-6 py-28"
    >
      {/* Content: items-end aligns subtitle to the right of the Name */}
      <div className="z-10 flex flex-col items-end justify-center w-fit mx-auto">
        <h1 id="hero-heading" className="text-fluid-h1 font-bold leading-none text-white uppercase mix-blend-difference tracking-tight">
          Forae Factory
        </h1>

        <div className="mt-1 relative" aria-hidden>
          <div className="relative overflow-hidden px-2 py-1 flex justify-end">
            {/* Invisible Spacer: Forces container to width of longest word */}
            <span className="text-fluid-h4 font-serif tracking-normal opacity-0 select-none whitespace-nowrap">
              Technology
            </span>

            {/* Actual Text: Floating on top, right-aligned */}
            <span className="absolute top-1 right-2 text-fluid-h4 font-serif tracking-normal text-accent whitespace-nowrap">
              {WORDS[index]}
            </span>

            {/* Curtain: Gold (accent) */}
            <motion.div
              className="absolute inset-0 bg-accent z-20"
              initial={{ scaleX: 0 }}
              animate={{
                scaleX: isRevealing ? 1 : 0,
                transformOrigin: isRevealing ? "left" : "right",
              }}
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            />
          </div>
        </div>
      </div>

      {/* Value proposition + calls to action */}
      <div className="z-10 mt-12 md:mt-16 flex flex-col items-center gap-8 text-center pointer-events-auto">
        <p className="max-w-xl text-fluid-body text-ink/85 leading-relaxed">{SITE_DESCRIPTION}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/#contact"
            className="rounded-full bg-ink px-8 py-4 text-sm font-bold uppercase tracking-wider text-surface transition-colors hover:bg-accent"
          >
            Start a project
          </Link>
          <Link
            href="/#projects"
            className="rounded-full border border-line/30 bg-surface/30 px-8 py-4 text-sm font-bold uppercase tracking-wider backdrop-blur-sm transition-colors hover:border-ink"
          >
            See the work
          </Link>
        </div>
      </div>

      {/* Scroll cue */}
      <div aria-hidden className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted">
        <span>Scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-muted to-transparent" />
      </div>
    </section>
  );
}

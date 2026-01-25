import { useStore } from "@/store/useStore";
import { useEffect, useRef, useState } from "react";
import { useInView, motion, AnimatePresence } from "framer-motion";

const WORDS = ["Strategy", "DesignOps", "Narrative", "Production", "Innovation"];

export default function HeroSection() {
  const setActiveSection = useStore((state) => state.setActiveSection);
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 });
  const [index, setIndex] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    if (isInView) setActiveSection("home");
  }, [isInView, setActiveSection]);

  useEffect(() => {
    // Custom "Curtain" Sequence
    const interval = setInterval(async () => {
      setIsRevealing(true); // Start curtain (Cover)

      // Wait for cover (0.5s)
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % WORDS.length); // Change text while hidden
        setIsRevealing(false); // End curtain (Reveal)
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      ref={ref}
      className="h-screen w-full flex items-center justify-center snap-start relative pointer-events-none"
    >
      {/* Content: items-end aligns subtitle to the right of the Name */}
      <div className="z-10 flex flex-col items-end justify-center w-fit mx-auto">
        <h1 className="text-fluid-h1 font-bold leading-none text-white uppercase mix-blend-difference tracking-tight">
          FORAE FACTORY
        </h1>

        <div className="mt-1 relative">
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
    </section>
  );
}

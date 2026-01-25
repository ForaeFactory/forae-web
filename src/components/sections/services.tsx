"use client";

import { useStore, DEFAULT_HERO_TEXTURE } from "@/store/useStore";
import { useEffect, useRef, useState } from "react";
import { useInView, motion, AnimatePresence } from "framer-motion";
import { services } from "@/data/content";

export default function ServicesSection() {
  const { setActiveSection, setHeroTexture } = useStore();
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isInView) {
      setActiveSection("services");
    } else {
      // Reset if leaving section
      setHeroTexture(DEFAULT_HERO_TEXTURE);
    }
  }, [isInView, setActiveSection, setHeroTexture]);

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
    setHeroTexture(services[index].image);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setHeroTexture(DEFAULT_HERO_TEXTURE);
  };

  return (
    <section
      id="services"
      ref={ref}
      className="h-screen w-full flex items-center justify-center snap-start relative px-10"
    >
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center z-10 pointer-events-none">
        {/* LEFT: Massive List */}
        <div className="flex flex-col pointer-events-auto">
          {services.map((service, i) => (
            <div
              key={i}
              className="group relative cursor-pointer"
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={handleMouseLeave}
            >
              <h3
                className={`text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter transition-all duration-300
                        ${hoveredIndex === i ? "text-white translate-x-4" : "text-white/20 hover:text-white/40"}`}
              >
                {service.title}
              </h3>
            </div>
          ))}
        </div>

        {/* RIGHT: Dynamic Details Panel */}
        <div className="hidden md:flex flex-col justify-center h-full pl-10 pointer-events-auto">
          <AnimatePresence mode="wait">
            {hoveredIndex !== null ? (
              <motion.div
                key={hoveredIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="border-l border-white/20 pl-6"
              >
                <h4 className="text-xl font-bold mb-4 text-white">
                  {services[hoveredIndex].title}
                </h4>
                <p className="text-2xl font-light text-white/80 leading-relaxed max-w-sm mb-8">
                  {services[hoveredIndex].description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {services[hoveredIndex].tags.map((tag, t) => (
                    <span
                      key={t}
                      className="px-3 py-1 border border-white/20 rounded-full text-xs uppercase tracking-widest text-white/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-white/20 text-lg"
              >
                Select an area of expertise using your cursor.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

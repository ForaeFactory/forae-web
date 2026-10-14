"use client";

import { useStore, DEFAULT_HERO_TEXTURE } from "@/store/useStore";
import { useEffect, useRef, useState } from "react";
import { useInView, motion, AnimatePresence } from "framer-motion";
import { services } from "@/data/content";

export default function ServicesSection() {
  const { setActiveSection, setHeroTexture } = useStore();
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 });
  // The first service is shown by default so the details never depend on hovering.
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (isInView) {
      setActiveSection("services");
    } else {
      // Reset if leaving section
      setHeroTexture(DEFAULT_HERO_TEXTURE);
    }
  }, [isInView, setActiveSection, setHeroTexture]);

  const activate = (index: number) => {
    setActiveIndex(index);
    setHeroTexture(services[index].image);
  };

  const active = services[activeIndex];

  return (
    <section
      id="services"
      ref={ref}
      aria-labelledby="services-heading"
      className="min-h-screen w-full flex items-center justify-center relative px-6 md:px-10 py-24"
    >
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center z-10">
        <div>
          <span className="eyebrow mb-6">Services</span>
          <h2 id="services-heading" className="sr-only">
            What we do
          </h2>

          {/* LEFT: Massive List */}
          <ul className="flex flex-col" onMouseLeave={() => setHeroTexture(DEFAULT_HERO_TEXTURE)}>
            {services.map((service, i) => (
              <li key={service.title} className="py-2 md:py-0">
                <button
                  type="button"
                  aria-pressed={activeIndex === i}
                  aria-controls="service-details"
                  onMouseEnter={() => activate(i)}
                  onFocus={() => activate(i)}
                  onClick={() => activate(i)}
                  className={`text-left text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter transition-all duration-300
                        ${activeIndex === i ? "text-ink md:translate-x-4" : "text-ink/40 hover:text-ink/70"}`}
                >
                  {service.title}
                </button>

                {/* Mobile: details inline under each title */}
                <div className="md:hidden mt-3 space-y-3">
                  <p className="text-lg text-ink/80 leading-relaxed">{service.description}</p>
                  <ul className="flex flex-wrap gap-2" aria-label={`${service.title} skills`}>
                    {service.tags.map((tag) => (
                      <li key={tag} className="px-3 py-1 border border-line/20 rounded-full text-xs uppercase tracking-widest text-muted">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT: Dynamic Details Panel (desktop) */}
        <div id="service-details" aria-live="polite" className="hidden md:flex flex-col justify-center h-full pl-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="border-l border-line/20 pl-6"
            >
              <h3 className="text-xl font-bold mb-4 text-ink">{active.title}</h3>
              <p className="text-2xl font-light text-ink/80 leading-relaxed max-w-sm mb-8">{active.description}</p>
              <ul className="flex flex-wrap gap-2" aria-label={`${active.title} skills`}>
                {active.tags.map((tag) => (
                  <li key={tag} className="px-3 py-1 border border-line/20 rounded-full text-xs uppercase tracking-widest text-muted">
                    {tag}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

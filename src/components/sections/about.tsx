"use client";

import { useStore, DEFAULT_HERO_TEXTURE } from "@/store/useStore";
import { useEffect, useRef } from "react";
import { useInView, motion } from "framer-motion";
import { agency } from "@/data/content";

export default function AboutSection() {
  const { setActiveSection, setHeroTexture } = useStore();
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      setActiveSection("about");
      setHeroTexture(DEFAULT_HERO_TEXTURE);
    }
  }, [isInView, setActiveSection, setHeroTexture]);

  return (
    <section
      id="about"
      ref={ref}
      className="min-h-screen w-full flex items-center justify-center snap-start relative px-10 py-24"
    >
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20 z-10">
        {/* LEFT: Sticky Header */}
        <div className="md:col-span-5 relative">
          <div className="md:sticky md:top-32">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            >
              <span className="block text-xs uppercase tracking-widest text-accent mb-4">
                The Studio
              </span>
              <h2 className="text-6xl md:text-8xl font-bold leading-none -ml-1 mb-6">
                FORAE
                <br />
                FACTORY
              </h2>
              <div className="h-[2px] w-20 bg-white/20 mb-6" />
              <p className="text-2xl text-accent font-bold mb-8">
                {agency.tagline}
              </p>

              {/* Inline Portrait - Replaced with minimal block for now as per Agency style */}
              {/* Inline Portrait - Studio Architecture */}
              {/* Image Removed by Request */}
            </motion.div>
          </div>
        </div>

        {/* RIGHT: Scrolling Bio */}
        <div className="md:col-span-7 flex flex-col justify-center space-y-12 md:space-y-24 pt-20 md:pt-40 pb-20">
          {/* Paragraph 1 */}
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="text-2xl md:text-4xl leading-tight tracking-wide font-bold"
            >
              {agency.description}
            </motion.p>
          </div>

          {/* Paragraph 2 */}
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.76, 0, 0.24, 1],
                delay: 0.1,
              }}
              className="text-2xl md:text-4xl leading-tight tracking-wide font-bold"
            >
              We believe in learning by doing, creating by coding, and leading
              by example. Let’s stop talking about innovation and actually build
              something that defines the future.
            </motion.p>
          </div>

          {/* Stats / Socials */}
          <div className="grid grid-cols-3 gap-8 border-t border-white/10 pt-10">
            <div>
              <span className="block text-xs uppercase tracking-widest text-white/40 mb-2">
                Founded
              </span>
              <span className="text-4xl font-bold">{agency.founded}</span>
            </div>
            <div>
              <span className="block text-xs uppercase tracking-widest text-white/40 mb-2">
                Projects
              </span>
              <span className="text-4xl font-bold text-accent">20+</span>
            </div>
            <div>
              <span className="block text-xs uppercase tracking-widest text-white/40 mb-2">
                Clients
              </span>
              <span className="text-4xl font-bold text-accent">10+</span>
            </div>
          </div>

          {/* Links */}
          {/* <div className="flex gap-6">
            {Object.entries(agency.socials).map(([key, url], i) => (
              <motion.a
                key={key}
                href={url}
                target="_blank"
                className="text-sm uppercase tracking-widest border-b border-white/30 pb-1 hover:text-white hover:border-white transition-all"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                {key}
              </motion.a>
            ))}
          </div> */}
        </div>
      </div>
    </section>
  );
}

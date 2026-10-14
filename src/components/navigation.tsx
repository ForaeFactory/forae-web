"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "projects", label: "Projects" },
    { id: "toolkit", label: "Toolkit" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const menuVariants = {
    initial: { x: "100%" },
    animate: {
      x: "0%",
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const },
    },
    exit: {
      x: "100%",
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const },
    },
  };

  const linkVariants = {
    initial: { x: 80, opacity: 0 },
    animate: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1] as const,
        delay: 0.1 + i * 0.1,
      },
    }),
    exit: {
      x: 80,
      opacity: 0,
      transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] as const },
    },
  };

  return (
    <>
      <div className="fixed inset-0 z-50 pointer-events-none mix-blend-difference text-white">
        {/* Top Header */}
        <div
          className="absolute top-10 left-10 pointer-events-auto cursor-pointer"
          onClick={() => scrollToSection("home")}
        >
          <img
            src="/images/logo/FF_Logo_wht.svg"
            alt="Forae Logo"
            className="w-12 h-auto object-contain"
          />
        </div>

        <div className="absolute top-10 right-10 flex items-center gap-6 pointer-events-auto">
          <button
            onClick={toggleMenu}
            className="flex flex-col gap-1.5 p-2 group hover:gap-2 transition-all duration-300"
          >
            <span
              className={`w-8 h-[2px] bg-white block transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`w-8 h-[2px] bg-white block transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`w-8 h-[2px] bg-white block transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Full Screen Menu Overlay - Right Side Slide */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed top-0 right-0 bottom-0 w-full md:w-[600px] z-[49] bg-black text-white flex flex-col justify-center px-10 md:px-24 shadow-2xl border-l border-white/10"
          >
            <div className="w-full">
              <div className="flex flex-col space-y-4">
                <motion.div
                  variants={linkVariants}
                  custom={0}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="border-b border-white/20 pb-4 mb-8"
                >
                  <span className="text-sm uppercase tracking-widest text-gray-500">
                    Navigation
                  </span>
                </motion.div>

                {navItems.map((item, i) => (
                  <div
                    key={item.id}
                    className="overflow-hidden"
                  >
                    <motion.button
                      custom={i + 1}
                      variants={linkVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      onClick={() => scrollToSection(item.id)}
                      className="text-4xl md:text-6xl font-bold uppercase tracking-tight pb-4 hover:text-accent transition-colors text-left"
                    >
                      {item.label}
                    </motion.button>
                  </div>
                ))}
              </div>

              {/* Footer Info in Menu */}
              <motion.div
                variants={linkVariants}
                custom={6}
                initial="initial"
                animate="animate"
                exit="exit"
                className="mt-20 flex flex-col gap-4 border-t border-white/20 pt-8"
              >
                {/* <div className="flex gap-4 text-sm uppercase tracking-widest text-gray-400">
                       <a href="www.linkedin.com/in/craigbrooks" className="hover:text-accent transition-colors">LinkedIn</a>
                    </div> */}
                <div className="text-sm uppercase tracking-widest text-gray-600">
                  Based in Austin, Texas
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

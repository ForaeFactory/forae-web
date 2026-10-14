"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { agency } from "@/data/content";
import { SITE_EMAIL, SITE_LOCATION } from "@/data/site";

const NAV_ITEMS = [
  { id: "projects", label: "Work" },
  { id: "services", label: "Services" },
  { id: "toolkit", label: "Toolkit" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

const EASE = [0.76, 0, 0.24, 1] as const;

const menuVariants = {
  initial: { x: "100%" },
  animate: { x: "0%", transition: { duration: 0.8, ease: EASE } },
  exit: { x: "100%", transition: { duration: 0.8, ease: EASE } },
};

const linkVariants = {
  initial: { x: 80, opacity: 0 },
  animate: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: EASE, delay: 0.1 + i * 0.08 },
  }),
  exit: { x: 80, opacity: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  // Lock page scroll, move focus into the menu, trap Tab, close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const toggle = toggleRef.current;
    const firstLink = menuRef.current?.querySelector<HTMLElement>("a");
    firstLink?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (event.key !== "Tab" || !menuRef.current) return;
      const focusable = [toggle, ...Array.from(menuRef.current.querySelectorAll<HTMLElement>("a, button"))].filter(
        (el): el is HTMLElement => Boolean(el),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      toggle?.focus();
    };
  }, [isOpen]);

  return (
    <header>
      <div className="fixed inset-x-0 top-0 z-50 pointer-events-none mix-blend-difference text-white">
        {/* Logo */}
        <Link
          href="/#home"
          aria-label="Forae Factory, back to top"
          className="absolute top-8 left-6 md:top-10 md:left-10 pointer-events-auto"
          onClick={closeMenu}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- small SVG mark, no optimization needed */}
          <img src="/images/logo/FF_Logo_wht.svg" alt="" className="w-12 h-auto object-contain" />
        </Link>

        <div className="absolute top-8 right-6 md:top-10 md:right-10 flex items-center gap-6 pointer-events-auto">
          <Link
            href="/#contact"
            className="hidden md:inline-block text-sm uppercase tracking-widest border-b border-white/40 pb-1 hover:border-white transition-colors"
          >
            Let&apos;s talk
          </Link>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls="site-menu"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="flex flex-col gap-1.5 p-2 group hover:gap-2 transition-all duration-300"
          >
            <span aria-hidden className={`w-8 h-[2px] bg-white block transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span aria-hidden className={`w-8 h-[2px] bg-white block transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`} />
            <span aria-hidden className={`w-8 h-[2px] bg-white block transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Full Screen Menu Overlay - Right Side Slide */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            ref={menuRef}
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            variants={menuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed top-0 right-0 bottom-0 w-full md:w-[600px] z-[49] bg-surface text-ink flex flex-col justify-center px-10 md:px-24 shadow-2xl border-l border-line/10"
          >
            <nav aria-label="Main" className="w-full">
              <motion.div
                variants={linkVariants}
                custom={0}
                initial="initial"
                animate="animate"
                exit="exit"
                className="border-b border-line/20 pb-4 mb-8"
              >
                <span className="text-sm uppercase tracking-widest text-muted">Navigation</span>
              </motion.div>

              <ul className="flex flex-col space-y-4">
                {NAV_ITEMS.map((item, i) => (
                  <li key={item.id} className="overflow-hidden">
                    <motion.a
                      href={`/#${item.id}`}
                      custom={i + 1}
                      variants={linkVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      onClick={closeMenu}
                      className="block text-4xl md:text-6xl font-bold uppercase tracking-tight pb-4 hover:text-accent transition-colors"
                    >
                      {item.label}
                    </motion.a>
                  </li>
                ))}
              </ul>

              {/* Footer Info in Menu */}
              <motion.div
                variants={linkVariants}
                custom={NAV_ITEMS.length + 1}
                initial="initial"
                animate="animate"
                exit="exit"
                className="mt-16 flex flex-col gap-4 border-t border-line/20 pt-8 text-sm uppercase tracking-widest"
              >
                <a href={`mailto:${SITE_EMAIL}`} className="normal-case tracking-normal text-lg hover:text-accent transition-colors">
                  {SITE_EMAIL}
                </a>
                {agency.socials.linkedin && (
                  <a href={agency.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors">
                    LinkedIn<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
                <span className="text-muted">Based in {SITE_LOCATION.label}</span>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

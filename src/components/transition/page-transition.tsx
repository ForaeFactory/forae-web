"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Click-to-expand page transition.
 *
 * The clicked image is cloned into a fixed overlay at its on-screen rect, grows
 * to fill the viewport (matching the case-study hero), and stays there while the
 * route changes underneath. The case-study hero calls notifyHeroReady() once its
 * image has loaded, and the overlay fades away, so the picture the visitor
 * clicked never leaves the screen.
 */

type Rect = { top: number; left: number; width: number; height: number };

type ExpandRequest = {
  href: string;
  src: string;
  rect: Rect;
};

type TransitionState = ExpandRequest & { phase: "expand" | "reveal" };

type PageTransitionContext = {
  expandTo: (request: ExpandRequest) => void;
  notifyHeroReady: () => void;
  isTransitioning: boolean;
};

const Context = createContext<PageTransitionContext | null>(null);

const EASE = [0.76, 0, 0.24, 1] as const;
const EXPAND_S = 0.85;
// Navigate once the backdrop has covered the old page, so the swap is never seen.
const NAVIGATE_AFTER_MS = 320;
// Never hold the overlay longer than this, even if the hero never reports in.
const MAX_HOLD_MS = 3200;

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [state, setState] = useState<TransitionState | null>(null);
  const expandDone = useRef(false);
  const heroReady = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const reveal = useCallback(() => {
    setState((current) => (current && current.phase !== "reveal" ? { ...current, phase: "reveal" } : current));
  }, []);

  const maybeReveal = useCallback(() => {
    if (expandDone.current && heroReady.current) reveal();
  }, [reveal]);

  const expandTo = useCallback(
    (request: ExpandRequest) => {
      if (prefersReducedMotion || state) {
        if (!state) router.push(request.href);
        return;
      }
      expandDone.current = false;
      heroReady.current = false;
      timers.current.forEach(clearTimeout);
      setState({ ...request, phase: "expand" });
      timers.current = [
        setTimeout(() => router.push(request.href), NAVIGATE_AFTER_MS),
        setTimeout(reveal, MAX_HOLD_MS),
      ];
    },
    [prefersReducedMotion, router, state, reveal],
  );

  const notifyHeroReady = useCallback(() => {
    heroReady.current = true;
    maybeReveal();
  }, [maybeReveal]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // While the overlay is up, entrance animations on the new page wait (see
  // .animate-rise in globals.css), so they play when the page is revealed.
  useEffect(() => {
    const root = document.documentElement;
    if (state?.phase === "expand") root.dataset.pageTransition = "active";
    else delete root.dataset.pageTransition;
  }, [state?.phase]);

  return (
    <Context.Provider value={{ expandTo, notifyHeroReady, isTransitioning: state !== null }}>
      {children}
      <AnimatePresence
        onExitComplete={() => {
          expandDone.current = false;
          setState(null);
        }}
      >
        {state && state.phase === "expand" && (
          <motion.div
            key="page-transition"
            aria-hidden
            className="fixed inset-0 z-[60] pointer-events-auto"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeOut" } }}
          >
            {/* Backdrop hides the old page while the new one mounts. */}
            <motion.div
              className="absolute inset-0 bg-surface"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: NAVIGATE_AFTER_MS / 1000, ease: "easeOut" }}
            />
            <motion.div
              className="absolute overflow-hidden bg-surface"
              initial={{
                top: state.rect.top,
                left: state.rect.left,
                width: state.rect.width,
                height: state.rect.height,
                borderRadius: 12,
              }}
              animate={{ top: 0, left: 0, width: "100vw", height: "100vh", borderRadius: 0 }}
              transition={{ duration: EXPAND_S, ease: EASE }}
              onAnimationComplete={() => {
                expandDone.current = true;
                maybeReveal();
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- reuses the exact, already-decoded source of the clicked image */}
              <motion.img
                src={state.src}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: EXPAND_S, ease: EASE }}
              />
              {/* Same gradient as the case-study hero, so the hand-off is invisible. */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ duration: EXPAND_S, ease: EASE }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Context.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(Context);
  if (!context) throw new Error("usePageTransition must be used inside PageTransitionProvider");
  return context;
}

/**
 * Finds the image a click should expand from: the element itself, one inside
 * it, or one elsewhere in the same [data-transition-scope] (e.g. a card whose
 * link and image are siblings). The first one actually on screen wins, so a
 * hidden phone-only thumbnail is skipped on desktop. Returns its rect and
 * decoded source, or null to fall back to a normal navigation.
 */
export function transitionSourceFrom(element: Element | null) {
  if (!element) return null;
  const selector = "[data-transition-source]";
  const scope = element.closest("[data-transition-scope]");
  const candidates = [
    ...(element.matches(selector) ? [element] : []),
    ...Array.from(element.querySelectorAll(selector)),
    ...Array.from(scope?.querySelectorAll(selector) ?? []),
  ];
  for (const source of candidates) {
    const img = source.querySelector("img");
    const rect = source.getBoundingClientRect();
    if (!img || rect.width === 0 || rect.height === 0) continue;
    return {
      src: img.currentSrc || img.src,
      rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
    };
  }
  return null;
}

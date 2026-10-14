'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';

// A gold "View" disc that trails the pointer while it is over a Work card.
// Same language as the hero: Forae gold and the Playfair italic of the
// rotating word, with an arrow that turns to point into the card as it opens.
export default function StripCursor({ visible }: { visible: boolean }) {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 400, damping: 35, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 400, damping: 35, mass: 0.4 });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [x, y]);

  return (
    <motion.div aria-hidden style={{ x: springX, y: springY }} className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block">
      <motion.div
        initial={false}
        animate={{ scale: visible ? 1 : 0, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
        className="-translate-x-1/2 -translate-y-1/2 flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-full bg-accent text-surface shadow-[0_10px_40px_rgb(0_0_0/0.35)]"
      >
        <span className="font-serif italic text-2xl leading-none">View</span>
        <motion.svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          initial={false}
          animate={{ rotate: visible ? 0 : -90 }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        >
          <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </motion.div>
    </motion.div>
  );
}

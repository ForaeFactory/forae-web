'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';

// A round "View" label that trails the pointer while it is over a Work card.
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
        transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
        className="-translate-x-1/2 -translate-y-1/2 flex h-24 w-24 items-center justify-center rounded-full bg-ink text-surface text-sm font-bold uppercase tracking-widest"
      >
        View
      </motion.div>
    </motion.div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/store/useStore';

const SECTIONS = ['home', 'projects', 'services', 'toolkit', 'about', 'contact'];

export default function ScrollManager() {
  const lenis = useStore((state) => state.lenis);
  const [isLocked, setIsLocked] = useState(false);
  
  // Track index manually to ensure sync
  const currentIndex = useRef(0);

  useEffect(() => {
    if (!lenis) return;

    const handleWheel = (e: WheelEvent) => {
      // Prevent default native scroll
      e.preventDefault();

      // If locked, do nothing (ignore scroll)
      if (isLocked) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      const nextIndex = currentIndex.current + direction;

      // Bounds check
      if (nextIndex < 0 || nextIndex >= SECTIONS.length) return;

      // LOCK interaction
      setIsLocked(true);
      currentIndex.current = nextIndex;

      // Trigger Lenis Scroll
      const targetId = `#${SECTIONS[nextIndex]}`;
      lenis.scrollTo(targetId, {
         duration: 1.5,
         easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Power4.out feel
         lock: true, // Lock lenis internal scroll during animation
      });

      // Unlock after delay (animation duration + hold time)
      // 1.5s scroll + 0.5s pause = 2s total lock
      setTimeout(() => {
         setIsLocked(false);
      }, 2000); 
    };
    
    // Add non-passive listener to cancel scroll
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    // Also handle touch for mobile "swipe" logic? 
    // For now purely Wheel as specifically requested "scroll requires another scroll" often implies desktop feel.
    // Touch usually keeps native momentum. 
    // Let's stick to Wheel for logic, leave touch native?
    // User asked "require another scroll", which implies discrete steps.
    // I will stick to wheel for now.

    return () => {
       window.removeEventListener('wheel', handleWheel);
    };
  }, [lenis, isLocked]);

  return null;
}

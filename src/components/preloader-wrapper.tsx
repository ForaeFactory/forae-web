'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Preloader from '@/components/preloader';

export default function PreloaderWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for the primitive counting animation to finish roughly
    // The Preloader component itself handles its own visual exit timing, 
    // but we can toggle the 'children' visibility or just overlay the preloader.
    // However, the Preloader has "exit" variants, so we should rely on AnimatePresence in the parent or inside.
    // Let's modify logic: The Preloader will sit ON TOP. When it's done, it slides up.
    // We can use a simple timeout for the wrapper state to unmount it after animation.
    
    // Total time = word duration * words + delay
    // 5 words * ~250ms + extra = ~1.5s - 2s
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <Preloader />}
      </AnimatePresence>
      {children}
    </>
  );
}

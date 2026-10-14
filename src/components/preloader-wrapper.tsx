'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Preloader, { PRELOADER_DURATION_MS } from '@/components/preloader';

const INTRO_SEEN_KEY = 'ff-intro-seen';

// Runs in <head> before first paint. Returning visitors in the same session and
// anyone who prefers reduced motion never see the intro, not even for a frame.
export const INTRO_SKIP_SCRIPT = `try{if(sessionStorage.getItem('${INTRO_SEEN_KEY}')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.intro='skip'}}catch(e){}`;

export default function PreloaderWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (document.documentElement.dataset.intro === 'skip') {
      setIsLoading(false);
      return;
    }
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, '1');
    } catch {
      // Storage can be blocked; the intro then simply plays each visit.
    }
    const timer = setTimeout(() => setIsLoading(false), PRELOADER_DURATION_MS + 150);
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

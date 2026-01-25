'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import LiquidPlane from './liquid-plane';
import ParallaxHero from './parallax-hero';
import { useStore } from '@/store/useStore';

export default function Scene() {
  const activeSection = useStore((state) => state.activeSection);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas 
         camera={{ position: [0, 0, 5], fov: 75 }}
         eventSource={document.body} // Fix: Listen to body events to ignore pointer-events-none
      >
        <Suspense fallback={null}>
           {['home', 'about', 'contact', 'toolkit'].includes(activeSection) ? (
              <ParallaxHero />
           ) : (
              <LiquidPlane />
           )}
        </Suspense>
      </Canvas>
    </div>
  );
}

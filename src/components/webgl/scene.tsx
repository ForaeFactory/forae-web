'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import LiquidPlane from './liquid-plane';
import ParallaxHero from './parallax-hero';
import { useStore } from '@/store/useStore';

// With frameloop="demand" nothing renders unless asked; pointer movement is
// what drives the parallax, so request a frame whenever it moves.
function PointerInvalidator() {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    const onMove = () => invalidate();
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', onMove);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onMove);
    };
  }, [invalidate]);
  return null;
}

// Mounted inside Suspense, so its effect runs only once the textures are loaded.
function ReadySignal({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return null;
}

export default function Scene({ onReady }: { onReady?: () => void }) {
  const activeSection = useStore((state) => state.activeSection);

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5], fov: 75 }}
      eventSource={document.body} // Listen to body events so the canvas can stay pointer-events-none
    >
      <PointerInvalidator />
      <Suspense fallback={null}>
        <ReadySignal onReady={onReady} />
        {['home', 'about', 'contact', 'toolkit'].includes(activeSection) ? (
          <ParallaxHero />
        ) : (
          <LiquidPlane />
        )}
      </Suspense>
    </Canvas>
  );
}

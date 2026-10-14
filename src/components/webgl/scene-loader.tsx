'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { DEFAULT_HERO_TEXTURE } from '@/store/useStore';

// Three.js stays out of the initial bundle and loads once the page is idle.
const Scene = dynamic(() => import('./scene'), { ssr: false });

function canRunScene() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * The hero rock as a plain image paints immediately (and is all that reduced-motion,
 * data-saver and no-WebGL visitors get); the interactive scene fades in over it.
 */
export default function SceneLoader() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!canRunScene()) return;
    const start = () => setEnabled(true);
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(start, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 800);
    return () => clearTimeout(id);
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 z-0 pointer-events-none">
      <Image
        src={DEFAULT_HERO_TEXTURE}
        alt=""
        fill
        priority
        sizes="100vw"
        className={`object-cover scale-[0.96] transition-opacity duration-1000 ${ready ? 'opacity-0' : 'opacity-100'}`}
      />
      {enabled && (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}>
          <Scene onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}

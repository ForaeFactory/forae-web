'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

import { useStore } from '@/store/useStore'

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const setLenis = useStore((state) => state.setLenis)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.1,
      smoothWheel: false, // Disable native smooth wheel because we handle it manually
    })
    
    lenisRef.current = lenis
    setLenis(lenis)

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}

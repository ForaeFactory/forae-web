"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";

type AutoplayVideoProps = {
  src: string;
  poster?: string;
  label: string;
  className?: string;
};

/**
 * Muted looping video that only downloads and plays while it is on screen.
 * Reduced-motion visitors get the poster until they press play, and everyone
 * gets a pause button (WCAG 2.2.2: moving content longer than 5 s).
 */
export default function AutoplayVideo({ src, poster, label, className = "" }: AutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [inView, setInView] = useState(false);
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);

  const paused = userPaused ?? Boolean(prefersReducedMotion);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.35,
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (inView && !paused) {
      // play() rejects when interrupted by a pause; that is expected here.
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [inView, paused]);

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className={className}
      />
      <button
        type="button"
        onClick={() => setUserPaused(playing)}
        aria-label={playing ? `Pause video: ${label}` : `Play video: ${label}`}
        className="absolute bottom-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-line/30 bg-surface/60 text-ink backdrop-blur-md transition-colors hover:bg-ink hover:text-surface pointer-events-auto"
      >
        {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
      </button>
    </>
  );
}

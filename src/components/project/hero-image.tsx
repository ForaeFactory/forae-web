"use client";

import Image from "next/image";
import { usePageTransition } from "@/components/transition/page-transition";

// The case-study hero image; tells the page transition when it is on screen so
// the expanding overlay can hand over without a flash.
export default function HeroImage({ src, alt }: { src: string; alt: string }) {
  const { notifyHeroReady } = usePageTransition();
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority
      sizes="100vw"
      className="object-cover opacity-60"
      onLoad={notifyHeroReady}
    />
  );
}

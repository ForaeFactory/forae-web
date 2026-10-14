"use client";

import { MotionConfig } from "framer-motion";

// reducedMotion="user" makes every Framer animation honour the OS
// "reduce motion" setting: transforms are skipped, opacity fades remain.
export default function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

'use client';

import { useStore, DEFAULT_HERO_TEXTURE } from '@/store/useStore';
import { useEffect, useRef } from 'react';
import { useInView, motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { toolkit } from '@/data/content';

export default function ToolkitSection() {
  const { setActiveSection, setHeroTexture } = useStore();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { amount: 0.1 }); // Trigger earlier for tall section

  // Scroll Progress Logic
  const { scrollYProgress } = useScroll({
     target: containerRef,
     offset: ["start start", "end end"]
  });

  // Parallax Transforms
  // Top: Left to Right (-50% to 0%) - Requires content to be effectively "left" initially
  const x1 = useTransform(scrollYProgress, [0, 1], ["-40%", "0%"]);
  
  // Middle: Right to Left (0% to -40%)
  const x2 = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  
  // Bottom: Left to Right
  const x3 = useTransform(scrollYProgress, [0, 1], ["-40%", "0%"]);

  useEffect(() => {
    if (isInView) {
      setActiveSection('toolkit');
      setHeroTexture(DEFAULT_HERO_TEXTURE);
    }
  }, [isInView, setActiveSection, setHeroTexture]);

  // Helper to repeat items for "Infinite" feel
  const Banner = ({ items, x, className }: { items: string[], x: MotionValue<string>, className?: string }) => (
     <motion.div aria-hidden style={{ x }} className={`flex whitespace-nowrap gap-10 md:gap-20 ${className}`}>
        {[...items, ...items, ...items].map((item, i) => (
           <span key={i} className="text-8xl md:text-[10rem] font-bold uppercase tracking-tighter leading-none shrink-0">
             {item}
           </span>
        ))}
     </motion.div>
  );

  return (
    <section id="toolkit" ref={containerRef} aria-labelledby="toolkit-heading" className="h-[200vh] w-full relative bg-black/20">
       {/* The moving banners repeat each item three times, so screen readers get this list instead. */}
       <div className="sr-only">
          <h2 id="toolkit-heading">Toolkit</h2>
          {(['strategy', 'creative', 'development'] as const).map((group) => (
             <ul key={group} aria-label={group}>
                {toolkit[group].map((item) => <li key={item}>{item}</li>)}
             </ul>
          ))}
       </div>
       <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden py-20">
          <div className="flex flex-col gap-10 md:gap-20">
             
             {/* Row 1: Strategy */}
             <div className="border-b border-white/10 pb-10">
                 <span aria-hidden className="block text-xs uppercase tracking-widest text-muted mb-4 px-10">Strategy</span>
                 <Banner items={toolkit.strategy} x={x1} className="text-white/20 stroke-text" />
             </div>

             {/* Row 2: Creative */}
             <div className="border-b border-white/10 pb-10">
                 <span aria-hidden className="block text-xs uppercase tracking-widest text-muted mb-4 px-10 text-right">Creative</span>
                 <Banner items={toolkit.creative} x={x2} className="text-white" />
             </div>

             {/* Row 3: Development */}
             <div>
                 <span aria-hidden className="block text-xs uppercase tracking-widest text-muted mb-4 px-10">Development</span>
                 <Banner items={toolkit.development} x={x3} className="text-white/20 stroke-text" />
             </div>

          </div>
       </div>
    </section>
  );
}

'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

type GalleryImage = { src: string; alt: string };

export default function HorizontalStoryGallery({ images, title, text }: { images: GalleryImage[]; title?: string; text?: string }) {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0.1, 0.85], ["0%", "-80%"]);

  return (
    <div ref={targetRef} className="relative h-[300vh] bg-surface">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col md:flex-row bg-surface">

         {/* Text Column - stacked above the strip on mobile, fixed left on desktop */}
         {(title || text) && (
             <div className="w-full md:w-[30vw] shrink-0 md:h-full flex flex-col justify-center px-6 pt-24 pb-6 md:px-12 md:py-0 z-20 bg-surface border-b md:border-b-0 md:border-r border-line/10">
                 {title && <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight mb-4 md:mb-6 text-ink">{title}</h2>}
                 {text && <p className="text-sm md:text-xl text-ink/85 leading-relaxed font-medium">{text}</p>}
             </div>
         )}

         {/* Gallery Column - Scrolling Right */}
         <div className="flex-1 min-h-0 min-w-0 overflow-hidden flex items-center bg-surface/50">
            <motion.ul style={{ x }} className="flex gap-4 md:gap-8 px-6 md:px-12 w-max">
                {images.map((img) => (
                    <li key={img.src} className="w-[80vw] md:w-[60vw] h-[40vh] md:h-[50vh] shrink-0 relative rounded-2xl overflow-hidden bg-surface-raised border border-line/5">
                        <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 60vw, 80vw" className="object-cover" />
                    </li>
                ))}
            </motion.ul>
         </div>
      </div>
    </div>
  );
}

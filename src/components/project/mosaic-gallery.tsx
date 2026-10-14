'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { MosaicImage } from '@/data/content';

// Mosaic spans in content.ts are authored for the 5-column desktop grid. On
// mobile the grid has 2 columns, so clamp spans to fit. Class names are spelled
// out in full so Tailwind can see them.
const MOBILE_COL_SPAN = ['col-span-1', 'col-span-1', 'col-span-2'];
const DESKTOP_COL_SPAN = ['md:col-span-1', 'md:col-span-1', 'md:col-span-2', 'md:col-span-3', 'md:col-span-4', 'md:col-span-5'];
const MOBILE_ROW_SPAN = ['row-span-1', 'row-span-1', 'row-span-2'];
const DESKTOP_ROW_SPAN = ['md:row-span-1', 'md:row-span-1', 'md:row-span-2', 'md:row-span-3', 'md:row-span-4'];

function mosaicSpanClasses(img: MosaicImage) {
  const col = Number(img.span?.match(/col-span-(\d+)/)?.[1] ?? 1);
  const row = Number(img.span?.match(/row-span-(\d+)/)?.[1] ?? 1);
  const pick = (classes: string[], n: number) => classes[Math.min(n, classes.length - 1)];
  return [
    pick(MOBILE_COL_SPAN, col),
    pick(DESKTOP_COL_SPAN, col),
    pick(MOBILE_ROW_SPAN, row),
    pick(DESKTOP_ROW_SPAN, row),
  ].join(' ');
}

export default function MosaicGallery({ images }: { images: (MosaicImage & { alt: string })[] }) {
  return (
    <ul className="max-w-[90vw] mx-auto grid grid-cols-2 md:grid-cols-5 grid-flow-row-dense md:grid-flow-row auto-rows-[160px] md:auto-rows-[300px] gap-4 px-4">
      {images.map((img, idx) => (
        <motion.li
          key={img.src}
          className={`relative overflow-hidden rounded-lg ${mosaicSpanClasses(img)}`}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: Math.min(idx, 5) * 0.08, ease: "easeOut" }}
        >
          <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 40vw, 50vw" className="object-cover" />
        </motion.li>
      ))}
    </ul>
  );
}

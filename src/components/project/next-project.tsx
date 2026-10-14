'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { imageAlt, projects } from '@/data/content';
import TransitionLink from '@/components/transition/transition-link';

/**
 * End-of-story hand-off: the next case study as a full-width panel whose image
 * opens up as you scroll toward it, then expands into that case study's hero
 * on click.
 */
export default function NextProject({ currentSlug }: { currentSlug: string }) {
  const index = projects.findIndex((project) => project.slug === currentSlug);
  const next = projects[(index + 1) % projects.length];
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const inset = useTransform(scrollYProgress, [0, 1], ['12%', '0%']);
  const clipPath = useTransform(inset, (value) => `inset(${value} ${value} 0% ${value} round 16px)`);

  return (
    <section ref={ref} aria-labelledby="next-project-heading" className="relative bg-surface pt-24">
      <TransitionLink href={`/project/${next.slug}`} className="group block">
        <div className="px-6 md:px-12 mb-8 flex items-end justify-between gap-6">
          <div>
            <span className="eyebrow mb-3">Next project</span>
            <h2 id="next-project-heading" className="text-fluid-h2 font-bold uppercase leading-none tracking-tight transition-colors group-hover:text-accent">
              {next.title}
            </h2>
          </div>
          <span aria-hidden className="hidden md:block text-sm uppercase tracking-widest text-muted">
            {next.type} &middot; {next.year}
          </span>
        </div>
        <motion.div style={{ clipPath }} className="relative h-[60vh] md:h-[85vh] w-full overflow-hidden" data-transition-source>
          <Image
            src={next.visuals.hero}
            alt={imageAlt(next, next.visuals.hero, 'hero image')}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-1000 ease-house group-hover:scale-[1.03]"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-surface/70 to-transparent" />
          <span
            aria-hidden
            className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-ink px-8 py-4 text-sm font-bold uppercase tracking-widest text-surface"
          >
            Open case study
          </span>
        </motion.div>
      </TransitionLink>
    </section>
  );
}

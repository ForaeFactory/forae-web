'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion';
import { imageAlt, projects } from '@/data/content';
import TransitionLink from '@/components/transition/transition-link';

/**
 * Index view of the work: every project name in big type. On desktop a preview
 * of the hovered project trails the cursor and leans with its speed; on phones
 * each row carries its own thumbnail. Either image is what the page transition
 * expands from.
 */
export default function WorkIndex() {
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 28 });
  const springY = useSpring(y, { stiffness: 260, damping: 28 });
  const skew = useTransform(useVelocity(springX), [-2500, 0, 2500], [-10, 0, 10], { clamp: true });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [x, y]);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10">
      <ul onMouseLeave={() => setActive(null)} className="border-b border-line/10">
        {projects.map((project, i) => (
          <li key={project.slug} data-transition-scope>
            <TransitionLink
              href={`/project/${project.slug}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              // z-[41]: the type reads over the fixed cursor preview (z-40).
              className="group relative z-[41] grid grid-cols-12 items-baseline gap-x-4 border-t border-line/10 py-6 md:py-8"
            >
              <span className="col-span-2 md:col-span-1 font-mono text-sm text-muted">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className={`col-span-10 md:col-span-7 text-4xl md:text-7xl font-bold uppercase tracking-tighter leading-none transition-[color,transform] duration-500 ease-house
                  ${active === null || active === i ? 'text-ink' : 'text-ink/35'} md:group-hover:translate-x-4`}
              >
                {project.title}
              </span>
              <span className="hidden md:block col-span-3 text-sm uppercase tracking-widest text-muted">{project.type}</span>
              <span className="hidden md:block col-span-1 text-right text-sm text-muted">{project.year}</span>

              {/* Phones: inline thumbnail (also the transition source) */}
              <span
                className="md:hidden col-span-12 mt-5 relative block aspect-[16/9] overflow-hidden rounded-xl"
                data-transition-source
              >
                <Image
                  src={project.visuals.hero}
                  alt={imageAlt(project, project.visuals.hero, 'hero image')}
                  fill
                  sizes="90vw"
                  className="object-cover"
                />
              </span>
              <span className="md:hidden col-span-12 mt-3 flex justify-between text-xs uppercase tracking-widest text-muted">
                <span>{project.type}</span>
                <span>{project.year}</span>
              </span>
            </TransitionLink>

            {/* Desktop: this project's slot in the cursor preview (a sibling, so the link can find it) */}
            <motion.span
              aria-hidden
              style={{ x: springX, y: springY, skewX: skew }}
              className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block"
            >
              <motion.span
                initial={false}
                animate={{
                  opacity: active === i ? 1 : 0,
                  scale: active === i ? 1 : 0.85,
                  clipPath: active === i ? 'inset(0% 0% 0% 0%)' : 'inset(50% 0% 50% 0%)',
                }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                className="-translate-x-1/2 -translate-y-1/2 relative block w-[26vw] aspect-[4/3] overflow-hidden rounded-xl"
                data-transition-source={active === i ? '' : undefined}
              >
                <Image src={project.visuals.hero} alt="" fill sizes="26vw" className="object-cover" />
              </motion.span>
            </motion.span>
          </li>
        ))}
      </ul>
    </div>
  );
}

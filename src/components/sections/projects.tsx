'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useScroll, useSpring, useTransform, motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { imageAlt, projects, type Project } from '@/data/content';
import AutoplayVideo from '@/components/autoplay-video';

// Vertical scroll per pixel of horizontal travel; below 1 the strip moves a
// little faster than the page scrolls, which keeps the section short.
const SCROLL_PER_PX = 0.75;

export default function ProjectsSection() {
  const setActiveSection = useStore((state) => state.setActiveSection);
  const targetRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLUListElement>(null);
  const isInView = useInView(targetRef, { amount: 0.2 });
  const [travel, setTravel] = useState(0);
  const travelValue = useMotionValue(0);

  const { scrollYProgress } = useScroll({ target: targetRef });

  // Measure how far the strip must slide so the last card ends fully in view,
  // whatever the number of projects or the screen size.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const measure = () => {
      const distance = Math.max(0, strip.scrollWidth - window.innerWidth);
      travelValue.set(distance);
      setTravel(distance);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(strip);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [travelValue]);

  useEffect(() => {
    if (isInView) setActiveSection('projects');
  }, [isInView, setActiveSection]);

  const x = useSpring(
    useTransform([scrollYProgress, travelValue], ([progress, distance]: number[]) => -progress * distance),
    { stiffness: 100, damping: 30, restDelta: 0.001 },
  );

  return (
    <section
      ref={targetRef}
      id="projects"
      aria-labelledby="projects-heading"
      className="relative bg-transparent"
      style={{ height: travel ? `calc(${Math.round(travel * SCROLL_PER_PX)}px + 100vh)` : '500vh' }}
    >
      {/* Sticky Container locks the view in place while we scroll "through" time */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        {/* Horizontal Moving Strip */}
        <motion.ul ref={stripRef} style={{ x }} className="flex gap-8 md:gap-16 pl-6 pr-6 md:pl-24 md:pr-24 w-max">
          {/* Title Card (Intro) */}
          <li className="w-[70vw] md:w-[30vw] shrink-0 flex flex-col justify-center border-l border-line/10 pl-8">
            <span className="eyebrow mb-4">Selected work · {projects.length} projects</span>
            <h2 id="projects-heading" className="text-fluid-h2 font-bold text-white leading-none uppercase mix-blend-difference">
              Selected<br />Works
            </h2>
            <p className="text-muted mt-6 max-w-xs text-sm">
              A collection of immersive creative projects, crafted with purpose and precision.
            </p>
          </li>

          {/* Project Cards */}
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { setHeroTexture } = useStore();
  const alt = imageAlt(project, project.visuals.hero, 'hero image');

  return (
    <li
      className="group relative isolate w-[85vw] md:w-[70vw] h-[70vh] shrink-0 flex flex-col justify-end p-6 md:p-12 border border-line/10 bg-black/20 overflow-hidden rounded-xl"
      onMouseEnter={() => setHeroTexture(project.visuals.hero)}
    >
      {/* Background Media (no z-index, so the video's pause button can sit above the card link) */}
      <div className="absolute inset-0 bg-surface-raised">
        {project.visuals.video ? (
          <AutoplayVideo
            src={project.visuals.video}
            poster={`/_next/image?url=${encodeURIComponent(project.visuals.hero)}&w=1920&q=75`}
            label={`${project.title} preview`}
            className="w-full h-full object-cover transition-all duration-500 group-hover:blur-lg"
          />
        ) : (
          <Image
            src={project.visuals.hero}
            alt={alt}
            fill
            sizes="(min-width: 768px) 70vw, 85vw"
            priority={index === 0}
            className="object-cover transition-all duration-500 group-hover:blur-lg"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 pointer-events-none" />
      </div>

      {/* "View Project" pill (visual only; the whole card is the link) */}
      <div aria-hidden className="absolute inset-0 z-[5] flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none">
        <span className="px-12 py-6 border border-white/30 rounded-full text-white uppercase tracking-widest text-xl bg-black/30 backdrop-blur-md">
          View Project
        </span>
      </div>

      {/* The whole card is one link */}
      <Link
        href={`/project/${project.slug}`}
        className="absolute inset-0 z-10 rounded-xl focus-visible:outline-offset-[-4px]"
      >
        <span className="sr-only">
          {project.title}: {project.type} case study for {project.client}, {project.year}
        </span>
      </Link>

      {/* Content (clicks pass through to the card link) */}
      <div aria-hidden className="relative z-10 w-full pointer-events-none">
        <h3 className="text-4xl md:text-7xl font-bold text-white mb-6 md:mb-8 uppercase tracking-tighter">
          {project.title}
        </h3>

        {/* Metadata Grid */}
        <dl className="w-full border-t border-white/30 pt-6 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 text-xs font-medium tracking-wide uppercase text-white/75">
          <div className="md:col-span-3 flex flex-col gap-1">
            <div className="flex gap-2">
              <dt className="font-bold text-white">Client:</dt> <dd>{project.client}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-bold text-white">Year:</dt> <dd>{project.year}</dd>
            </div>
          </div>
          <div className="md:col-span-3 flex gap-2">
            <dt className="font-bold text-white">Location:</dt> <dd>{project.location}</dd>
          </div>
          <div className="hidden md:flex md:col-span-6 flex-wrap gap-2 justify-end">
            <dt className="sr-only">Disciplines</dt>
            {project.tools.map((tool) => (
              <dd key={tool} className="px-3 py-2 rounded-full border border-white/20 text-white/85 bg-white/5 backdrop-blur-md">
                {tool}
              </dd>
            ))}
          </div>
        </dl>
      </div>
    </li>
  );
}

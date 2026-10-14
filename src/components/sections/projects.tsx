'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useScroll, useSpring, useTransform, motion } from 'framer-motion';
import { DEFAULT_HERO_TEXTURE, useStore } from '@/store/useStore';
import { imageAlt, projects, type Project } from '@/data/content';
import AutoplayVideo from '@/components/autoplay-video';
import TransitionLink from '@/components/transition/transition-link';
import WorkIndex from '@/components/work/work-index';
import StripCursor from '@/components/work/strip-cursor';
import { stripPointer } from '@/components/work/strip-state';

// Three.js for the strip loads only when the strip is actually shown.
const FilmStripCanvas = dynamic(() => import('@/components/work/film-strip-canvas'), { ssr: false });

// Vertical scroll per pixel of horizontal travel; below 1 the strip moves a
// little faster than the page scrolls, which keeps the section short.
const SCROLL_PER_PX = 0.75;

type View = 'strip' | 'index';

function canRunWebGL() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function ProjectsSection() {
  const setActiveSection = useStore((state) => state.setActiveSection);
  const setHeroTexture = useStore((state) => state.setHeroTexture);
  // The strip is the default; phones and reduced-motion visitors start on the index.
  const [view, setView] = useState<View>('strip');

  useEffect(() => {
    if (window.matchMedia('(max-width: 767px), (prefers-reduced-motion: reduce)').matches) setView('index');
  }, []);

  const changeView = (next: View) => {
    stripPointer.hovered = null;
    setView(next);
    document.getElementById('projects')?.scrollIntoView({ block: 'start' });
  };

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.2 });
  useEffect(() => {
    if (isInView) setActiveSection('projects');
    // Drop the last hovered project's image so it doesn't linger behind Services.
    else setHeroTexture(DEFAULT_HERO_TEXTURE);
  }, [isInView, setActiveSection, setHeroTexture]);

  return view === 'strip' ? (
    <FilmStrip sectionRef={sectionRef} onViewChange={changeView} />
  ) : (
    <section ref={sectionRef} id="projects" aria-labelledby="projects-heading" className="relative py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-12 md:mb-16 flex flex-wrap items-end justify-between gap-8">
        <div>
          <span className="eyebrow mb-4">Selected work · {projects.length} projects</span>
          <h2 id="projects-heading" className="text-fluid-h2 font-bold leading-none uppercase">
            Selected Works
          </h2>
        </div>
        <ViewToggle view="index" onChange={changeView} />
      </div>
      <WorkIndex />
    </section>
  );
}

function ViewToggle({ view, onChange }: { view: View; onChange: (view: View) => void }) {
  return (
    <div role="group" aria-label="Show work as" className="inline-flex rounded-full border border-line/20 p-1 text-xs font-bold uppercase tracking-widest">
      {(['strip', 'index'] as const).map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={view === option}
          onClick={() => view !== option && onChange(option)}
          className={`rounded-full px-4 py-2 transition-colors ${view === option ? 'bg-ink text-surface' : 'text-muted hover:text-ink'}`}
        >
          {option === 'strip' ? 'Strip' : 'Index'}
        </button>
      ))}
    </div>
  );
}

function FilmStrip({
  sectionRef,
  onViewChange,
}: {
  sectionRef: React.RefObject<HTMLElement>;
  onViewChange: (view: View) => void;
}) {
  const stripRef = useRef<HTMLUListElement>(null);
  const [travel, setTravel] = useState(0);
  const travelValue = useMotionValue(0);
  const [glMode, setGlMode] = useState<'pending' | 'on' | 'off'>('pending');
  const [glReady, setGlReady] = useState(false);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const nearView = useInView(sectionRef, { margin: '50% 0px 50% 0px' });

  useEffect(() => setGlMode(canRunWebGL() ? 'on' : 'off'), []);
  const handleReady = useCallback(() => setGlReady(true), []);

  const { scrollYProgress } = useScroll({ target: sectionRef });

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

  const x = useSpring(
    useTransform([scrollYProgress, travelValue], ([progress, distance]: number[]) => -progress * distance),
    { stiffness: 100, damping: 30, restDelta: 0.001 },
  );

  const hover = (slug: string | null) => {
    stripPointer.hovered = slug;
    setHoveredSlug(slug);
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-labelledby="projects-heading"
      data-webgl={glReady ? 'ready' : undefined}
      className="relative bg-transparent"
      style={{ height: travel ? `calc(${Math.round(travel * SCROLL_PER_PX)}px + 100vh)` : '500vh' }}
    >
      {/* Sticky Container locks the view in place while we scroll "through" time */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        {/* WebGL layer: draws each card's image behind its DOM text */}
        <div aria-hidden className="absolute inset-0 z-0 pointer-events-none">
          {glMode === 'on' && <FilmStripCanvas items={stripItems} active={nearView} onReady={handleReady} />}
        </div>

        {/* Horizontal Moving Strip */}
        <motion.ul ref={stripRef} style={{ x }} className="relative z-10 flex gap-8 md:gap-16 pl-6 pr-6 md:pl-24 md:pr-24 w-max">
          {/* Title Card (Intro) */}
          <li className="w-[70vw] md:w-[30vw] shrink-0 flex flex-col justify-center border-l border-line/10 pl-8">
            <span className="eyebrow mb-4">Selected work · {projects.length} projects</span>
            <h2 id="projects-heading" className="text-fluid-h2 font-bold text-white leading-none uppercase mix-blend-difference">
              Selected<br />Works
            </h2>
            <p className="text-muted mt-6 mb-8 max-w-xs text-sm">
              A collection of immersive creative projects, crafted with purpose and precision.
            </p>
            <div>
              <ViewToggle view="strip" onChange={onViewChange} />
            </div>
          </li>

          {/* Project Cards */}
          {projects.map((project, i) => (
            <StripCard
              key={project.slug}
              project={project}
              index={i}
              glMode={glMode}
              onHover={(over) => hover(over ? project.slug : null)}
            />
          ))}
        </motion.ul>
      </div>

      <StripCursor visible={hoveredSlug !== null} />
    </section>
  );
}

const stripItems = projects.map((project) => ({
  slug: project.slug,
  image: project.visuals.hero,
  video: project.visuals.video,
}));

function StripCard({
  project,
  index,
  glMode,
  onHover,
}: {
  project: Project;
  index: number;
  glMode: 'pending' | 'on' | 'off';
  onHover: (over: boolean) => void;
}) {
  const { setHeroTexture } = useStore();
  const alt = imageAlt(project, project.visuals.hero, 'hero image');

  return (
    <li
      data-transition-scope
      data-strip-card
      className="group relative isolate w-[85vw] md:w-[70vw] h-[70vh] shrink-0 flex flex-col justify-end p-6 md:p-12 border border-line/10 overflow-hidden rounded-xl md:cursor-none"
      onMouseEnter={() => {
        onHover(true);
        setHeroTexture(project.visuals.hero);
      }}
      onMouseLeave={() => onHover(false)}
    >
      {/* DOM media: the fallback, the layout box the WebGL plane copies, and the page-transition source */}
      <div
        data-strip-media={project.slug}
        data-transition-source
        className="absolute inset-0 bg-surface-raised transition-opacity duration-700"
      >
        <Image
          src={project.visuals.hero}
          alt={alt}
          fill
          sizes="(min-width: 768px) 70vw, 85vw"
          priority={index === 0}
          className="object-cover transition-transform duration-700 ease-house group-hover:scale-105"
        />
        {glMode === 'off' && project.visuals.video && (
          <AutoplayVideo
            src={project.visuals.video}
            poster={`/_next/image?url=${encodeURIComponent(project.visuals.hero)}&w=1920&q=75`}
            label={`${project.title} preview`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>
      {/* Title shade for the DOM fallback; the WebGL layer draws its own */}
      <div aria-hidden data-strip-media className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 pointer-events-none" />

      {/* The whole card is one link */}
      <TransitionLink
        href={`/project/${project.slug}`}
        className="absolute inset-0 z-10 rounded-xl focus-visible:outline-offset-[-4px]"
      >
        <span className="sr-only">
          {project.title}: {project.type} case study for {project.client}, {project.year}
        </span>
      </TransitionLink>

      {/* Keyboard focus gets the label the mouse gets from the cursor */}
      <div aria-hidden className="absolute inset-0 z-[5] flex items-center justify-center opacity-0 group-has-[a:focus-visible]:opacity-100 transition-opacity duration-300 pointer-events-none">
        <span className="px-10 py-5 rounded-full bg-accent text-surface font-serif italic text-2xl">View project</span>
      </div>

      {/* Content (clicks pass through to the card link) */}
      <div aria-hidden className="relative z-10 w-full pointer-events-none">
        <span className="block font-mono text-sm text-white/70 mb-3">
          {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
        </span>
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

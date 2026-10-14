'use client';

import Image from 'next/image';
import { imageAlt, projects, type Project } from '@/data/content';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface MoreProjectsProps {
  currentSlug: string;
}

export default function MoreProjects({ currentSlug }: MoreProjectsProps) {
  const currentIndex = projects.findIndex((p) => p.slug === currentSlug);
  // Start with the next project so the grid reads as "what's next".
  const otherProjects = [...projects.slice(currentIndex + 1), ...projects.slice(0, currentIndex)];

  return (
    <section aria-labelledby="more-projects-heading" className="w-full bg-surface-raised py-32 px-4 md:px-12 border-t border-line/10">
      <div className="max-w-[90vw] mx-auto">
        <motion.h2
          id="more-projects-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-ink mb-20 text-center"
        >
          More Selected Projects
        </motion.h2>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {otherProjects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project, index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isHovered) {
      // play() rejects if interrupted by a pause; that's expected here.
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isHovered]);

  return (
    <motion.li
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group"
    >
      <Link
        href={`/project/${project.slug}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
      >
        <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl bg-surface border border-line/10 mb-6">
          {/* Static Image */}
          <Image
            src={project.visuals.hero}
            alt={imageAlt(project, project.visuals.hero, 'hero image')}
            fill
            sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
            className={`object-cover transition-opacity duration-700 ${isHovered && project.visuals.video ? 'opacity-0' : 'opacity-100'}`}
          />

          {/* Video Preview: loads only when hovered or focused */}
          {project.visuals.video && (
            <video
              ref={videoRef}
              src={project.visuals.video}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
        </div>

        <div className="space-y-2">
            <span className="text-xs font-medium tracking-widest text-muted uppercase">{project.type}</span>
            <h3 className="text-2xl font-bold text-ink group-hover:text-accent transition-colors">{project.title}</h3>
        </div>
      </Link>
    </motion.li>
  );
}

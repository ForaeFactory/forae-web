'use client';

import { projects } from '@/data/content';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

interface MoreProjectsProps {
  currentSlug: string;
}

export default function MoreProjects({ currentSlug }: MoreProjectsProps) {
  const otherProjects = projects.filter(p => p.slug !== currentSlug);

  return (
    <section className="w-full bg-zinc-950 py-32 px-4 md:px-12 border-t border-white/10">
      <div className="max-w-[90vw] mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-white mb-20 text-center"
        >
          More Selected Projects
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {otherProjects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: any, index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/project/${project.slug}`}>
        <div 
          className="relative w-full aspect-[4/5] overflow-hidden rounded-xl bg-gray-900 border border-white/10 mb-6"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Static Image */}
          <img 
            src={project.visuals.hero} 
            alt={project.title} 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isHovered && project.visuals.video ? 'opacity-0' : 'opacity-100'}`}
          />

          {/* Video Preview */}
          {project.visuals.video && (
            <video
              src={project.visuals.video}
              muted
              loop
              playsInline
              // We only play if hovered to save resources, or we can autoPlay and control opacity
              // Auto-playing all 4 videos might be heavy, but "captivating". 
              // Let's rely on hover for playback to be performant yet interactive.
              ref={(el) => {
                if (el) {
                  isHovered ? el.play() : el.pause();
                  if (!isHovered) el.currentTime = 0;
                }
              }}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
        </div>

        <div className="space-y-2">
            <span className="text-xs font-medium tracking-widest text-white/50 uppercase">{project.type}</span>
            <h3 className="text-2xl font-bold text-white group-hover:text-gray-300 transition-colors">{project.title}</h3>
        </div>
      </Link>
    </motion.div>
  );
}

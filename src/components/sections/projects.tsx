'use client';

import { useStore } from '@/store/useStore';
import { useRef } from 'react';
import { useScroll, useTransform, useSpring, motion } from 'framer-motion';
import { projects, type Project } from '@/data/content';
import Link from 'next/link';

export default function ProjectsSection() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Calculate horizontal travel: Move left by (Total Width - Viewport). 
  // For 6 items at ~600px + gaps, roughly -75% is a safe start, usually tuned by eyeball or exact px.
  const x = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]), {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    // Height 500vh determines the "length" of the scroll track (Heavier scroll)
    <section ref={targetRef} id="projects" className="relative h-[500vh] bg-transparent">
      
      {/* Sticky Container locks the view in place while we scroll "through" time */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        
        {/* Horizontal Moving Strip */}
        <motion.div 
          style={{ x }} 
          className="flex gap-16 px-20 pl-24 w-max"
        >
          {/* Title Card (Intro) */}
          <div className="w-[30vw] shrink-0 flex flex-col justify-center border-l border-white/10 pl-8">
            <h2 className="text-fluid-h2 font-bold text-white leading-none uppercase mix-blend-difference">
              Selected<br/>Works
            </h2>
            <p className="text-gray-400 mt-6 max-w-xs text-sm">
              A collection of immersive creative projects, crafted with purpose and precision.
            </p>
          </div>

          {/* Project Cards */}
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}

          {/* End Spacer */}
          <div className="w-[20vw]" />
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const { setHeroTexture } = useStore();
  
  return (
    <motion.div 
      className="group relative w-[85vw] md:w-[70vw] h-[70vh] shrink-0 cursor-pointer flex flex-col justify-end p-8 md:p-12 border border-white/10 bg-black/20 backdrop-blur-sm overflow-hidden rounded-xl"
      onMouseEnter={() => setHeroTexture(project.visuals.hero)}
    >
      {/* Background Media */}
      <div className="absolute inset-0 -z-10 bg-gray-900 transition-transform duration-700 ease-out">
         {project.visuals.video ? (
            <video
              src={project.visuals.video}
              poster={project.visuals.hero}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover transition-all duration-500 group-hover:blur-lg"
            />
         ) : (
            <img 
              src={project.visuals.hero} 
              alt={project.title} 
              className="w-full h-full object-cover transition-all duration-500 group-hover:blur-lg"
            />
         )}
         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
      </div>

      {/* View Project Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0">
          <Link href={`/project/${project.slug}`} className="pointer-events-auto">
             <span className="px-12 py-6 border border-white/30 rounded-full text-white uppercase tracking-widest text-xl bg-black/30 backdrop-blur-md hover:bg-white hover:text-black transition-colors block">
                View Project
             </span>
          </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full pointer-events-none">
        {/* Title */}
        <Link href={`/project/${project.slug}`} className="pointer-events-auto block w-fit">
           <h3 className="text-5xl md:text-7xl font-bold text-white mb-8 transition-colors duration-300 uppercase tracking-tighter">
             {project.title}
           </h3>
        </Link>
        
        {/* Metadata Grid */}
        <div className="w-full border-t border-white/30 pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 text-sm md:text-base font-medium tracking-wide">
            
            {/* Col 1: Client & Year */}
            <div className="md:col-span-3 flex flex-col gap-1">
                <div className="flex gap-2 text-white/60 uppercase text-xs">
                    <span className="font-bold text-white">Client:</span> {project.client}
                </div>
                <div className="flex gap-2 text-white/60 uppercase text-xs">
                    <span className="font-bold text-white">Year:</span> {project.year}
                </div>
            </div>

            {/* Col 2: Location */}
            <div className="md:col-span-3 flex flex-col gap-1">
                 <div className="flex gap-2 text-white/60 uppercase text-xs">
                    <span className="font-bold text-white">Location:</span> {project.location}
                </div>
            </div>

             {/* Col 3: Categories / Tools */}
            <div className="md:col-span-6 flex flex-wrap gap-2 justify-start md:justify-end">
                {project.tools?.map((tool: string, i: number) => (
                    <span key={i} className="px-3 py-2 rounded-full border border-white/20 text-xs uppercase text-white/80 bg-white/5 backdrop-blur-md">
                        {tool}
                    </span>
                ))}
            </div>

        </div>
      </div>
    </motion.div>
  );
}

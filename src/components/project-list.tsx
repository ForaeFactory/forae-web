'use client';

import Link from 'next/link';
import { projects } from '@/data/content';
import { motion } from 'framer-motion';

export default function ProjectList() {
  return (
    <div className="w-full grid grid-cols-1 gap-y-12 lg:gap-y-24 py-24">
      {projects.map((project, index) => (
        <motion.div
          key={project.slug}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group relative border-t border-white/20 pt-8 lg:grid lg:grid-cols-12 lg:gap-8"
        >
          {/* Project Info */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              <span className="block text-xs uppercase tracking-widest text-gray-500 mb-2">{project.type}</span>
              <Link href={`/project/${project.slug}`}>
                 <motion.h2 
                   layoutId={`title-${project.slug}`}
                   className="text-4xl lg:text-5xl font-bold cursor-pointer hover:text-gray-300 transition-colors"
                 >
                   {project.title}
                 </motion.h2>
              </Link>
            </div>
            <p className="mt-4 text-gray-400 max-w-sm hidden lg:block">{project.description}</p>
          </div>

          {/* Project Type/Arrow (Visual decoration) */}
          <div className="lg:col-span-7 flex items-end justify-end mt-4 lg:mt-0">
             <Link href={`/project/${project.slug}`} className="block overflow-hidden rounded-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500">
               {/* Small preview or 'Read Case Study' text */}
               <div className="relative overflow-hidden">
                  <span className="text-xl italic font-light group-hover:translate-x-2 transition-transform duration-300 inline-block">
                     View Project &rarr;
                  </span>
               </div>
             </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

'use client';

import { projects, type MosaicImage } from '@/data/content';
import { notFound } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import MagneticButton from '@/components/magnetic-button';
import Link from 'next/link';
import { useRef } from 'react';
import ThemeToggleBlock from '@/components/blocks/theme-toggle-block';
import MoreProjects from '@/components/more-projects';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const projectIndex = projects.findIndex((p) => p.slug === params.slug);
  const project = projects[projectIndex];

  if (!project) {
    notFound();
  }

  // Refs for Parallax (Optional polish, keeping simple for now)
  const containerRef = useRef(null);

  return (
    <main ref={containerRef} className="min-h-screen bg-black text-white selection:bg-white/20">
      
      {/* Navigation: Close Button */}
      <div className="fixed top-8 right-8 z-50">
        <Link href="/">
           <MagneticButton className="px-6 py-3 rounded-full border border-white/20 bg-black/40 backdrop-blur-md hover:bg-white hover:text-black transition-colors duration-300 uppercase text-sm tracking-widest">
              Close
           </MagneticButton>
        </Link>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen w-full flex flex-col justify-between p-8 md:p-12 overflow-hidden">
         {/* Background Media */}
         <div className="absolute inset-0 z-0">
             <img src={project.visuals.hero} alt={project.title} className="w-full h-full object-cover opacity-60" />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
         </div>

         {/* Top Meta */}
         <div className="relative z-10 flex justify-between uppercase tracking-widest text-xs md:text-sm text-white/70">
            <span>{project.client}</span>
            <span>{project.year}</span>
         </div>

         {/* Bottom Meta Grid */}
         <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/20 pt-6 uppercase tracking-widest text-xs md:text-sm text-white/70">
             <div>
                <span className="block text-white font-bold mb-1">Role</span>
                {project.role}
             </div>
             <div>
                <span className="block text-white font-bold mb-1">Location</span>
                {project.location}
             </div>
             <div className="col-span-2 flex flex-wrap gap-2 justify-end items-start">
                 {project.tools?.map((t: string, i: number) => (
                     <span key={i} className="px-2 py-1 border border-white/20 rounded-full">{t}</span>
                 ))}
             </div>
         </div>
      </section>
      <section className="bg-black py-32">
         <div className="space-y-32">
             
             {/* Fallback Description (if no story) */}
             {!project.story && (
                 <div className="max-w-3xl mx-auto text-center px-4">
                     <p className="text-2xl md:text-4xl leading-relaxed font-light text-gray-300">
                        {project.description}
                     </p>
                 </div>
             )}

             {/* Story Blocks */}
             {project.story?.map((block, i) => {
                 if (block.type === 'centered-text') {
                     return (
                         <div key={i} className="max-w-5xl mx-auto text-center px-4">
                             <p className="text-2xl md:text-4xl leading-relaxed text-gray-200">
                                {block.text}
                             </p>
                         </div>
                     );
                 }
                 if (block.type === 'text-block') {
                     return (
                         <div key={i} className="max-w-4xl mx-auto px-4 space-y-6 -mb-24">
                             <h3 className="text-4xl md:text-5xl font-bold uppercase tracking-tight">{block.title}</h3>
                             <p className="text-2xl text-gray-400 leading-relaxed font-light">{block.text}</p>
                         </div>
                     );
                 }
                 if (block.type === 'full-image') {
                     return (
                         <div key={i} className="w-[95vw] mx-auto h-[80vh] relative overflow-hidden rounded-xl">
                             <img src={block.src} alt="" className="w-full h-full object-cover" />
                         </div>
                     );
                 }
                 if (block.type === 'image-row') {
                     return (
                         <div key={i} className="max-w-[95vw] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
                             {block.images.map((img: string, idx: number) => (
                                 <div key={idx} className="h-[40vh] md:h-[60vh] relative overflow-hidden rounded-xl">
                                     <img src={img} alt="" className="w-full h-full object-cover" />
                                 </div>
                             ))}
                         </div>
                     );
                 }
                 if (block.type === 'theme-toggle') {
                    return (
                        <ThemeToggleBlock 
                            key={i}
                            title={block.title}
                            text={block.text}
                            images={block.images}
                        />
                    );
                 }
                 if (block.type === 'split') {
                     return (
                         <div key={i} className="max-w-[90vw] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4">
                             <div className="space-y-6 md:px-12">
                                <h3 className="text-4xl md:text-6xl font-bold uppercase tracking-tight">{block.title}</h3>
                                <div className="space-y-4">
                                    {block.text.split('\n').map((paragraph: string, idx: number) => (
                                        <p key={idx} className="text-xl text-gray-400 leading-relaxed">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                             </div>
                             
                             {/* Image Container - Swaps logic based on layout prop */}
                             {block.layout === 'stacked' ? (
                                 <div className="flex flex-col gap-8">
                                    {block.images?.map((img: string, idx: number) => (
                                        <div key={idx} className="h-[50vh] w-full rounded-xl overflow-hidden relative">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                 </div>
                             ) : (
                                 <div className="relative h-[60vh] w-full flex items-center justify-center">
                                    {block.images ? (
                                        <>
                                            {/* Back Image (Offset Left) */}
                                            <div className="absolute h-[85%] w-auto z-0 opacity-80 blur-[1px] transform -translate-x-24 translate-y-6">
                                                <img src={block.images[1]} alt="" className="h-full w-auto object-contain" />
                                            </div>
                                            {/* Front Image (Centered/Right) */}
                                            <div className="absolute h-[95%] w-auto z-10 shadow-2xl transform translate-x-12">
                                                <img src={block.images[0]} alt="" className="h-full w-auto object-contain" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="h-full rounded-xl overflow-hidden relative">
                                            <img src={block.src} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                 </div>
                             )}
                         </div>
                     );
                 }
                 // Horizontal Scroll Block
                 if (block.type === 'horizontal-gallery') {
                    return (
                        <HorizontalStoryGallery 
                            key={i} 
                            images={block.images} 
                            title={block.title}
                            text={block.text}
                        />
                    );
                 }
                 // Mosaic Gallery Block
                 if (block.type === 'mosaic-gallery') {
                     return (
                         <div key={i} className="max-w-[90vw] mx-auto grid grid-cols-2 md:grid-cols-5 grid-flow-row-dense md:grid-flow-row auto-rows-[160px] md:auto-rows-[300px] gap-4 px-4">
                             {block.images.map((img, idx) => {
                                 const spanClass = mosaicSpanClasses(img);

                                 return (
                                     <motion.div 
                                        key={idx} 
                                        className={`relative overflow-hidden rounded-lg ${spanClass}`}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                                     >
                                          <img src={img.src} alt="" className="w-full h-full object-cover" />
                                     </motion.div>
                                 );
                             })}
                         </div>
                     );
                 }
                 // Centered Video Block
                 if (block.type === 'centered-video') {
                     return (
                         <div key={i} className="flex flex-col items-center gap-8 py-12">
                             {block.title && (
                                <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-center max-w-4xl px-4">{block.title}</h3>
                             )}
                             <div className="w-[70vw] h-[60vh] relative rounded-2xl overflow-hidden bg-gray-900 border border-white/10 shadow-2xl">
                                 <video 
                                     src={block.src} 
                                     className="w-full h-full object-cover" 
                                     autoPlay 
                                     muted 
                                     loop 
                                     playsInline
                                 />
                             </div>
                         </div>
                     );
                 }
                 return null;
             })}
         </div>
      </section>

      <MoreProjects currentSlug={params.slug} />
    </main>
  );
}

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

function HorizontalStoryGallery({ images, title, text }: { images: string[], title?: string, text?: string }) {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0.1, 0.85], ["0%", "-80%"]);

  return (
    <div ref={targetRef} className="relative h-[300vh] bg-black">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col md:flex-row bg-black">

         {/* Text Column - stacked above the strip on mobile, fixed left on desktop */}
         {(title || text) && (
             <div className="w-full md:w-[30vw] shrink-0 md:h-full flex flex-col justify-center px-6 pt-24 pb-6 md:px-12 md:py-0 z-20 bg-black border-b md:border-b-0 md:border-r border-white/10">
                 {title && <h3 className="text-2xl md:text-4xl font-bold uppercase tracking-tight mb-4 md:mb-6 text-white">{title}</h3>}
                 {text && <p className="text-sm md:text-xl text-gray-200 leading-relaxed font-medium">{text}</p>}
             </div>
         )}

         {/* Gallery Column - Scrolling Right */}
         <div className="flex-1 min-h-0 min-w-0 overflow-hidden flex items-center bg-black/50">
            <motion.div style={{ x }} className="flex gap-4 md:gap-8 px-6 md:px-12 w-max">
                {images.map((img, i) => (
                    <div key={i} className="w-[80vw] md:w-[60vw] h-[40vh] md:h-[50vh] shrink-0 relative rounded-2xl overflow-hidden transition-all duration-500 bg-gray-900 border border-white/5">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                ))}
            </motion.div>
         </div>
      </div>
    </div>
  );
}

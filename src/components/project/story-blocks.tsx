import Image from 'next/image';
import { imageAlt, type Project } from '@/data/content';
import ThemeToggleBlock from '@/components/blocks/theme-toggle-block';
import AutoplayVideo from '@/components/autoplay-video';
import HorizontalStoryGallery from '@/components/project/horizontal-gallery';
import MosaicGallery from '@/components/project/mosaic-gallery';

// Server-rendered story blocks; only the galleries, theme toggle and video are
// client islands.
export default function StoryBlocks({ project }: { project: Project }) {
  return (
    <section aria-label={`${project.title} case study`} className="bg-surface py-32">
      <div className="space-y-32">
        {/* Fallback Description (if no story) */}
        {!project.story && (
          <div className="max-w-3xl mx-auto text-center px-4">
            <p className="text-2xl md:text-4xl leading-relaxed font-light text-ink/80">{project.description}</p>
          </div>
        )}

        {project.story?.map((block, i) => {
          if (block.type === 'centered-text') {
            return (
              <div key={i} className="max-w-5xl mx-auto text-center px-4">
                <p className="text-2xl md:text-4xl leading-relaxed text-ink/90">{block.text}</p>
              </div>
            );
          }
          if (block.type === 'text-block') {
            return (
              <div key={i} className="max-w-4xl mx-auto px-4 space-y-6 -mb-24">
                <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight">{block.title}</h2>
                <p className="text-2xl text-muted leading-relaxed font-light">{block.text}</p>
              </div>
            );
          }
          if (block.type === 'full-image') {
            return (
              <div key={i} className="w-[95vw] mx-auto h-[50vh] md:h-[80vh] relative overflow-hidden rounded-xl">
                <Image src={block.src} alt={imageAlt(project, block.src)} fill sizes="95vw" className="object-cover" />
              </div>
            );
          }
          if (block.type === 'image-row') {
            return (
              <div key={i} className="max-w-[95vw] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
                {block.images.map((img, idx) => (
                  <div key={img} className="h-[40vh] md:h-[60vh] relative overflow-hidden rounded-xl">
                    <Image src={img} alt={imageAlt(project, img, undefined, idx)} fill sizes="(min-width: 768px) 32vw, 95vw" className="object-cover" />
                  </div>
                ))}
              </div>
            );
          }
          if (block.type === 'theme-toggle') {
            return <ThemeToggleBlock key={i} title={block.title} text={block.text} images={block.images} />;
          }
          if (block.type === 'split') {
            return (
              <div key={i} className="max-w-[90vw] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4">
                <div className="space-y-6 md:px-12">
                  <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight">{block.title}</h2>
                  <div className="space-y-4">
                    {block.text.split('\n').map((paragraph, idx) => (
                      <p key={idx} className="text-xl text-muted leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Image Container - Swaps logic based on layout prop */}
                {block.layout === 'stacked' ? (
                  <div className="flex flex-col gap-8">
                    {block.images?.map((img, idx) => (
                      <div key={img} className="h-[50vh] w-full rounded-xl overflow-hidden relative">
                        <Image src={img} alt={imageAlt(project, img, block.title, idx)} fill sizes="(min-width: 768px) 45vw, 90vw" className="object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="relative h-[50vh] md:h-[60vh] w-full flex items-center justify-center overflow-hidden md:overflow-visible">
                    {block.images ? (
                      <>
                        {/* Back Image (Offset Left) */}
                        <div className="absolute h-[85%] w-auto z-0 opacity-80 blur-[1px] -translate-x-10 md:-translate-x-24 translate-y-6">
                          <Image src={block.images[1]} alt={imageAlt(project, block.images[1], block.title, 1)} width={750} height={1500} sizes="(min-width: 768px) 25vw, 45vw" className="h-full w-auto object-contain" />
                        </div>
                        {/* Front Image (Centered/Right) */}
                        <div className="absolute h-[95%] w-auto z-10 shadow-2xl translate-x-6 md:translate-x-12">
                          <Image src={block.images[0]} alt={imageAlt(project, block.images[0], block.title, 0)} width={750} height={1500} sizes="(min-width: 768px) 25vw, 45vw" className="h-full w-auto object-contain" />
                        </div>
                      </>
                    ) : block.src ? (
                      <div className="h-full w-full rounded-xl overflow-hidden relative">
                        <Image src={block.src} alt={imageAlt(project, block.src, block.title)} fill sizes="(min-width: 768px) 45vw, 90vw" className="object-cover" />
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            );
          }
          if (block.type === 'horizontal-gallery') {
            return (
              <HorizontalStoryGallery
                key={i}
                images={block.images.map((src, idx) => ({ src, alt: imageAlt(project, src, block.title, idx) }))}
                title={block.title}
                text={block.text}
              />
            );
          }
          if (block.type === 'mosaic-gallery') {
            return (
              <MosaicGallery
                key={i}
                images={block.images.map((img, idx) => ({ ...img, alt: imageAlt(project, img.src, 'gallery', idx) }))}
              />
            );
          }
          if (block.type === 'centered-video') {
            return (
              <div key={i} className="flex flex-col items-center gap-8 py-12">
                {block.title && (
                  <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-center max-w-4xl px-4">{block.title}</h2>
                )}
                <div className="w-[90vw] md:w-[70vw] aspect-video md:aspect-auto md:h-[60vh] relative rounded-2xl overflow-hidden bg-surface-raised border border-line/10 shadow-2xl">
                  <AutoplayVideo
                    src={block.src}
                    label={block.title ? `${project.title}: ${block.title}` : `${project.title} video`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </section>
  );
}

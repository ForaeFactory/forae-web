import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProject, projects } from '@/data/content';
import { projectSchemas } from '@/data/structured-data';
import { SITE_NAME } from '@/data/site';
import JsonLd from '@/components/json-ld';
import MagneticButton from '@/components/magnetic-button';
import MoreProjects from '@/components/more-projects';
import ProjectHero from '@/components/project/project-hero';
import StoryBlocks from '@/components/project/story-blocks';
import SiteFooter from '@/components/site-footer';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

// Every case study is known at build time, so all of them are prerendered and
// any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: ProjectPageProps): Metadata {
  const project = getProject(params.slug);
  if (!project) return {};

  const title = `${project.title}: ${project.type}`;
  const url = `/project/${project.slug}`;
  const image = `/images/og/${project.slug}.jpg`;

  return {
    title,
    description: project.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
      description: project.description,
      images: [{ url: image, width: 1200, height: 630, alt: `${project.title} case study` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description: project.description,
      images: [image],
    },
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProject(params.slug);
  if (!project) notFound();

  return (
    <>
      <JsonLd data={projectSchemas(project)} />

      {/* Navigation: back to the work */}
      <nav aria-label="Case study" className="fixed top-6 right-6 md:top-8 md:right-8 z-50">
        <Link href="/#projects" aria-label="Close case study and return to the work">
          <MagneticButton className="px-6 py-3 rounded-full border border-line/20 bg-surface/40 backdrop-blur-md hover:bg-ink hover:text-surface transition-colors duration-300 uppercase text-sm tracking-widest">
            Close
          </MagneticButton>
        </Link>
      </nav>

      <main id="main" className="min-h-screen bg-surface text-ink selection:bg-white/20">
        <ProjectHero project={project} />
        <StoryBlocks project={project} />
        <MoreProjects currentSlug={project.slug} />
      </main>

      <SiteFooter />
    </>
  );
}

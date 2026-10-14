import HeroImage from '@/components/project/hero-image';
import Link from 'next/link';
import { imageAlt, type Project } from '@/data/content';

export default function ProjectHero({ project }: { project: Project }) {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between gap-12 p-6 pt-24 md:p-12 overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        <HeroImage src={project.visuals.hero} alt={imageAlt(project, project.visuals.hero, 'hero image')} />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent opacity-90" />
      </div>

      {/* Breadcrumb + year */}
      <div className="relative z-10 flex justify-between uppercase tracking-widest text-xs md:text-sm text-ink/80">
        <nav aria-label="Breadcrumb">
          <ol className="flex gap-2">
            <li>
              <Link href="/#projects" className="hover:text-accent transition-colors">
                Work
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page">{project.client}</li>
          </ol>
        </nav>
        <span>{project.year}</span>
      </div>

      {/* Title + meta */}
      <div className="relative z-10 space-y-8">
        <div className="space-y-4 max-w-5xl">
          <span className="eyebrow animate-rise [animation-delay:300ms]">{project.type}</span>
          <h1 className="overflow-hidden pb-1 text-fluid-h2 font-bold uppercase leading-none tracking-tight">
            <span className="block animate-rise [animation-delay:450ms]">{project.title}</span>
          </h1>
        </div>

        <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-line/20 pt-6 uppercase tracking-widest text-xs md:text-sm text-ink/80">
          <div>
            <dt className="text-ink font-bold mb-1">Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt className="text-ink font-bold mb-1">Location</dt>
            <dd>{project.location}</dd>
          </div>
          <div className="col-span-2">
            <dt className="sr-only">Disciplines</dt>
            <dd>
              <ul className="flex flex-wrap gap-2 md:justify-end">
                {project.tools.map((tool) => (
                  <li key={tool} className="px-2 py-1 border border-line/20 rounded-full">
                    {tool}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

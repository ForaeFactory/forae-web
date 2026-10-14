import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/data/content";
import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <main id="main" className="min-h-screen flex flex-col justify-center px-6 md:px-16 py-32 bg-surface text-ink">
        <span className="eyebrow mb-6">Error 404</span>
        <h1 className="text-fluid-h2 font-bold uppercase leading-none tracking-tight max-w-4xl">
          This page went off the map.
        </h1>
        <p className="mt-8 max-w-xl text-fluid-body text-muted">
          The link may be old or mistyped. Head back to the work, or jump straight into a case study.
        </p>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/"
            className="rounded-full bg-ink px-8 py-4 text-sm font-bold uppercase tracking-wider text-surface transition-colors hover:bg-accent"
          >
            Back to home
          </Link>
          <Link
            href="/#contact"
            className="rounded-full border border-line/30 px-8 py-4 text-sm font-bold uppercase tracking-wider transition-colors hover:border-ink"
          >
            Start a project
          </Link>
        </div>

        <nav aria-label="Case studies" className="mt-20 border-t border-line/10 pt-8">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-lg">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link href={`/project/${project.slug}`} className="hover:text-accent transition-colors">
                  {project.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
      <SiteFooter />
    </>
  );
}

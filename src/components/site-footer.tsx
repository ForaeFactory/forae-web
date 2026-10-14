import Link from "next/link";
import { agency } from "@/data/content";
import { SITE_EMAIL, SITE_LOCATION, SITE_NAME } from "@/data/site";

const SECTION_LINKS = [
  { href: "/#projects", label: "Work" },
  { href: "/#services", label: "Services" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

const SOCIAL_LABELS: Record<string, string> = { linkedin: "LinkedIn", github: "GitHub" };

export default function SiteFooter() {
  return (
    <footer className="relative z-10 bg-surface-raised border-t border-line/10 px-6 md:px-10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto grid gap-16 md:grid-cols-12">
        <div className="md:col-span-6 space-y-6">
          <span className="eyebrow">Next step</span>
          <p className="text-4xl md:text-6xl font-bold uppercase leading-none tracking-tight">
            Have a project
            <br />
            in mind?
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-sm font-bold uppercase tracking-wider text-surface transition-colors hover:bg-accent"
          >
            Start a project <span aria-hidden>&rarr;</span>
          </Link>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted mb-4">Explore</h2>
          <ul className="space-y-3 text-lg">
            {SECTION_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-accent transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3 space-y-8">
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted mb-4">Contact</h2>
            <a href={`mailto:${SITE_EMAIL}`} className="text-lg hover:text-accent transition-colors break-all">
              {SITE_EMAIL}
            </a>
            <p className="text-muted mt-2">{SITE_LOCATION.label}</p>
          </div>
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted mb-4">Follow</h2>
            <ul className="flex gap-6 text-lg">
              {Object.entries(agency.socials).map(([network, url]) => (
                <li key={network}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                    {SOCIAL_LABELS[network] ?? network}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-line/10 flex flex-col md:flex-row justify-between gap-4 text-sm text-muted">
        <p>
          &copy; {new Date().getFullYear()} {SITE_NAME}. Est. {agency.founded}.
        </p>
        <p>{agency.tagline}</p>
      </div>
    </footer>
  );
}

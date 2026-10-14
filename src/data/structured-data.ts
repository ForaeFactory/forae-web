import { agency, services, type Project } from "@/data/content";
import { SITE_DESCRIPTION, SITE_EMAIL, SITE_LOCATION, SITE_NAME, SITE_URL } from "@/data/site";

const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo/forae-logo-512.png`,
    image: `${SITE_URL}/images/og/home.jpg`,
    description: SITE_DESCRIPTION,
    slogan: agency.tagline,
    email: SITE_EMAIL,
    foundingDate: agency.founded,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE_LOCATION.city,
      addressRegion: SITE_LOCATION.region,
      addressCountry: SITE_LOCATION.country,
    },
    areaServed: "US",
    knowsAbout: services.map((service) => service.title),
    sameAs: Object.values(agency.socials),
  };
}

export function projectSchemas(project: Project) {
  const url = `${SITE_URL}/project/${project.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "@id": `${url}#work`,
      name: project.title,
      headline: `${project.title}: ${project.type}`,
      description: project.description,
      url,
      image: `${SITE_URL}/images/og/${project.slug}.jpg`,
      dateCreated: project.year,
      genre: project.type,
      keywords: project.tools.join(", "),
      locationCreated: { "@type": "Place", name: project.location },
      sourceOrganization: { "@id": ORGANIZATION_ID },
      creator: { "@id": ORGANIZATION_ID },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Work", item: `${SITE_URL}/#projects` },
        { "@type": "ListItem", position: 2, name: project.title, item: url },
      ],
    },
  ];
}

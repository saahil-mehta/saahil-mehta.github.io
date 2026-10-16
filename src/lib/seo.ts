// JSON-LD builders. Every page carries Person; the home page adds ProfilePage and inner
// pages add BreadcrumbList. Values come from profile.yaml only.
import { profile, isoMonth } from "./profile";

const { person, roles, education, site } = profile;
const current = roles[0];

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url}/#person`,
    name: person.name,
    url: site.url,
    email: `mailto:${person.email}`,
    jobTitle: person.title,
    worksFor: { "@type": "Organization", name: current.org, url: "https://www.southpole.com" },
    alumniOf: education.map((e) => ({ "@type": "EducationalOrganization", name: e.org })),
    sameAs: [person.links.github, person.links.linkedin],
    address: { "@type": "PostalAddress", addressLocality: "London", addressCountry: "GB" },
    knowsAbout: [
      ...profile.skills.ai.slice(0, 4),
      ...profile.skills.platform.slice(0, 4),
      ...profile.skills.governance.slice(0, 2),
    ],
    hasOccupation: roles.map((r) => ({
      "@type": "Occupation",
      name: r.title,
      ...(isoMonth(r.start) ? { startDate: isoMonth(r.start) } : {}),
      ...(isoMonth(r.end) ? { endDate: isoMonth(r.end) } : {}),
    })),
  };
}

export function profilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: { "@id": `${site.url}/#person` },
    name: `${person.name}: ${person.title}`,
    description: site.description,
    url: site.url,
  };
}

export function breadcrumbJsonLd(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name, item: `${site.url}${path}` },
    ],
  };
}

export function pageTitle(section?: string): string {
  return section ? `${section} · ${site.title_suffix}` : `${person.name} · ${person.title}`;
}

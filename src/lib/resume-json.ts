// JSON Resume (https://jsonresume.org/schema) built from profile.yaml.
import { profile, isoMonth } from "./profile";

export function resumeJson() {
  const { person, summaries, roles, projects, volunteering, education, skills, site } = profile;
  return {
    $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
    basics: {
      name: person.name,
      label: person.title,
      email: person.email,
      url: site.url,
      summary: summaries.cv,
      location: { city: "London", countryCode: "GB" },
      profiles: [
        { network: "GitHub", username: "saahil-mehta", url: person.links.github },
        { network: "LinkedIn", username: "saahil-mehta", url: person.links.linkedin },
      ],
    },
    work: roles.map((r) => ({
      name: r.unit ? `${r.org}, ${r.unit}` : r.org,
      position: r.title,
      location: r.location,
      startDate: isoMonth(r.start),
      ...(isoMonth(r.end) ? { endDate: isoMonth(r.end) } : {}),
      summary: r.site_desc,
      highlights: r.cv_bullets,
    })),
    volunteer: volunteering.map((v) => ({
      organization: v.venue.split(" · ")[0],
      position: v.venue.split(" · ")[1] ?? "Volunteer",
      ...(v.link ? { url: v.link } : {}),
      summary: v.cv_line,
    })),
    education: education.map((e) => ({
      institution: e.org,
      studyType: e.degree,
      score: e.grade,
      ...(e.years ? { startDate: `${e.years.split(" - ")[0]}-09-01`, endDate: `${e.years.split(" - ")[1]}-09-01` } : {}),
    })),
    skills: [
      { name: "Platform", keywords: skills.platform },
      { name: "AI", keywords: skills.ai },
      { name: "Governance", keywords: skills.governance },
      { name: "Leadership", keywords: skills.leadership },
    ],
    projects: projects
      .filter((p) => p.status === "live" || p.status === "in_progress")
      .map((p) => ({
        name: p.name,
        description: p.cv_line,
        keywords: p.tags,
        entity: p.org,
        ...(p.link ? { url: p.link } : {}),
      })),
    meta: { canonical: `${site.url}/resume.json`, version: "v1.0.0" },
  };
}

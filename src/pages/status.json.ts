import type { APIRoute } from "astro";
import { profile, featuredProjects, opening, stillFor, stillLightFor, nodeState } from "../lib/profile";
import { BUILD_DATE, BUILD_MONTH, durationLabel, monthsInProduction } from "../lib/dates";

// Machine-readable rendition of the record: the same facts the home page renders, for the
// GitHub profile README's daily re-render and for anything else that wants them. Older
// keys (banner, components, releases) stay for readers that still use them.
export const GET: APIRoute = () => {
  const { person, projects, roles, volunteering, education, site } = profile;
  const live = projects.filter((p) => p.status === "live").length;
  const building = projects.filter((p) => p.status === "in_progress").length;
  const people = site.stats.find((s) => s.label.includes("employees"))?.value ?? null;
  const n = site.narrative;
  const abs = (path: string) => `${site.url}${path}`;
  const body = {
    generated_at: BUILD_DATE.toISOString(),
    month: BUILD_MONTH,
    source: `${site.url}/status.json`,
    operator: {
      name: person.name,
      title: person.title,
      employer: "South Pole",
      location: person.location,
      url: site.url,
      github: person.links.github,
      linkedin: person.links.linkedin,
      email: person.email,
      book_a_call: person.links.calendly,
      portrait: abs("/portrait-still.webp"),
      resume_pdf: abs("/Saahil-Mehta-Resume.pdf"),
    },
    narrative: {
      statement: n.statement,
      statement_key: n.statement_key,
      role_line: n.role_line,
      now: n.now,
      ledes: n.ledes,
      end_card: n.end_card,
    },
    featured: featuredProjects.map((p) => p.name),
    banner: {
      heading: "All systems operational",
      operational: live,
      in_build: building,
      people_served: people,
    },
    components: projects.map((p) => ({
      name: p.name,
      venue: p.venue,
      category: p.category,
      status: p.status,
      since: p.since,
      until: p.until,
      months_in_production: monthsInProduction(p.since, p.until),
      duration: durationLabel(p.since, p.until),
      metric: p.metric,
      summary: p.site_summary,
      opening: opening(p.site_summary),
      tags: p.tags,
      link: p.link,
      still: abs(stillFor(p)),
      still_light: abs(stillLightFor(p)),
    })),
    releases: roles.map((r) => ({
      tag: `v${r.start.replace("-", ".")}`,
      title: r.title,
      org: r.org,
      unit: r.unit,
      start: r.start,
      end: r.end,
      location: r.location,
      summary: r.site_desc,
      line: r.site_line ?? r.site_desc,
    })),
    community: volunteering.map((v) => ({ name: v.name, venue: v.venue, year: v.year, link: v.link })),
    education: education.map((e) => ({ degree: e.degree, org: e.org, location: e.location, years: e.years, grade: e.grade })),
    ecosystem: site.ecosystem
      ? {
          note: site.ecosystem.note ?? null,
          nodes: site.ecosystem.nodes.map((n) => ({ id: n.id, name: n.name, line: n.line ?? null, kind: n.kind ?? "system", project: n.project ?? null, state: nodeState(n) })),
          edges: site.ecosystem.edges,
        }
      : null,
    roadmap: site.roadmap ?? null,
    diagrams: {
      platform: site.ecosystem ? { dark: abs("/diagrams/platform-dark.svg"), light: abs("/diagrams/platform-light.svg"), title: "How it fits together", lede: n.ledes.platform } : null,
      roadmap: site.roadmap ? { dark: abs("/diagrams/roadmap-dark.svg"), light: abs("/diagrams/roadmap-light.svg"), title: "The plan", lede: n.ledes.plan } : null,
    },
    files: {
      resume_pdf: abs("/Saahil-Mehta-Resume.pdf"),
      resume_json: abs("/resume.json"),
      cv_md: abs("/cv.md"),
      llms_txt: abs("/llms.txt"),
      status_json: abs("/status.json"),
    },
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
};

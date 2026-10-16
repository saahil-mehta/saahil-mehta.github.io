import type { APIRoute } from "astro";
import { profile } from "../lib/profile";
import { BUILD_DATE, BUILD_MONTH, durationLabel, monthsInProduction } from "../lib/dates";

// Machine-readable status page: the same facts the home page renders, for the GitHub
// profile README's daily re-render and for anything else that wants the numbers.
export const GET: APIRoute = () => {
  const { person, projects, roles, site } = profile;
  const live = projects.filter((p) => p.status === "live").length;
  const building = projects.filter((p) => p.status === "in_progress").length;
  const people = site.stats.find((s) => s.label.includes("employees"))?.value ?? null;
  const body = {
    generated_at: BUILD_DATE.toISOString(),
    month: BUILD_MONTH,
    source: `${site.url}/status.json`,
    operator: {
      name: person.name,
      title: person.title,
      employer: "South Pole",
      url: site.url,
      github: person.links.github,
      linkedin: person.links.linkedin,
      email: person.email,
      book_a_call: person.links.calendly,
    },
    banner: {
      heading: "All systems operational",
      operational: live,
      in_build: building,
      people_served: people,
    },
    components: projects.map((p) => ({
      name: p.name,
      venue: p.venue,
      status: p.status,
      since: p.since,
      until: p.until,
      months_in_production: monthsInProduction(p.since, p.until),
      duration: durationLabel(p.since, p.until),
      metric: p.metric,
      summary: p.site_summary,
      tags: p.tags,
      link: p.link,
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
    })),
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
};

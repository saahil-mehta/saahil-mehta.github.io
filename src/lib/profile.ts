// Loads profile/profile.yaml at build time and validates it. A bad field fails the build
// with the path to the offending key, so the site can never ship a half-rendered page.
import raw from "../../profile/profile.yaml?raw";
import { parse } from "yaml";
import { z } from "astro/zod";

const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "want YYYY-MM");
const monthOrPresent = z.union([month, z.literal("present")]);

const Role = z.object({
  org: z.string(),
  unit: z.string().nullable(),
  title: z.string(),
  start: month,
  end: monthOrPresent,
  location: z.string(),
  tags: z.array(z.string()),
  cv_bullets: z.array(z.string()).min(1),
  site_desc: z.string(),
  site_line: z.string().optional(),
  linkedin_desc: z.string(),
});

const Project = z.object({
  name: z.string(),
  org: z.string(),
  venue: z.string(),
  period: z.string(),
  status: z.enum(["live", "in_progress", "paused", "archived"]),
  category: z.string(),
  mark: z.string().optional(),
  since: month,
  until: month.nullable(),
  metric: z.object({ value: z.string(), label: z.string() }),
  tags: z.array(z.string()),
  icon: z.string(),
  link: z.string().url().nullable(),
  cv_line: z.string(),
  site_summary: z.string(),
  site_detail: z.string().nullable(),
});

const Volunteering = z.object({
  name: z.string(),
  venue: z.string(),
  year: z.string(),
  link: z.string().url().nullable(),
  icon: z.string(),
  tags: z.array(z.string()),
  cv_line: z.string(),
  challenge: z.string(),
  details: z.array(z.object({ title: z.string(), paragraphs: z.array(z.string()).min(1) })),
  outcome: z.string().nullable(),
});

const Education = z.object({
  org: z.string(),
  degree: z.string(),
  location: z.string(),
  years: z.string().nullable(),
  grade: z.string(),
  desc: z.string(),
});

const FilmLine = z.object({ lead: z.string(), text: z.string() });
const quarter = z.string().regex(/^\d{4}-Q[1-4]$/, "want YYYY-Qn");
const EcosystemNode = z.object({
  id: z.string(),
  name: z.string(),
  line: z.string().optional(),
  col: z.number().int().optional(),
  row: z.number().int().optional(),
  span: z.number().int().optional(),
  kind: z.enum(["system", "people", "band"]).optional(),
  project: z.string().optional(),
  state: z.enum(["built", "in_build", "planned"]).optional(),
});

const PageMeta = z.object({ title: z.string(), description: z.string().min(50).max(170) });

const Profile = z.object({
  person: z.object({
    name: z.string(),
    title: z.string(),
    title_official: z.string(),
    headline: z.string(),
    location: z.string(),
    email: z.string().email(),
    links: z.object({
      github: z.string().url(),
      linkedin: z.string().url(),
      calendly: z.string().url(),
      site: z.string().url(),
    }),
  }),
  summaries: z.object({ cv: z.string(), site_bio: z.string(), linkedin: z.string() }),
  roles: z.array(Role).min(1),
  projects: z.array(Project).min(1),
  volunteering: z.array(Volunteering),
  education: z.array(Education),
  skills: z.object({
    platform: z.array(z.string()),
    ai: z.array(z.string()),
    governance: z.array(z.string()),
    leadership: z.array(z.string()),
  }),
  site: z.object({
    url: z.string().url(),
    title_suffix: z.string(),
    description: z.string().min(50).max(300),
    og_image: z.string(),
    stats: z.array(z.object({ value: z.number(), prefix: z.string(), suffix: z.string(), label: z.string() })).length(4),
    featured_projects: z.array(z.string()).min(1),
    narrative: z.object({
      statement: z.string(),
      statement_key: z.string(),
      role_line: z.string(),
      portrait_caption: z.string(),
      now: z.array(z.string()).min(1),
      ledes: z.object({
        work: z.string(),
        shipping: z.string(),
        experience: z.string(),
        beyond: z.string(),
        contact: z.string(),
        platform: z.string(),
        plan: z.string(),
      }),
      end_card: z.string(),
    }),
    ecosystem: z
      .object({
        note: z.string().optional(),
        band_title: z.string().optional(),
        columns: z.array(z.object({ title: z.string(), from: z.number().int(), to: z.number().int() })).optional(),
        nodes: z.array(EcosystemNode).min(2),
        edges: z.array(z.object({ from: z.string(), to: z.string(), label: z.string() })).min(1),
      })
      .optional(),
    roadmap: z
      .object({
        project: z.string(),
        workstreams: z.array(z.object({ name: z.string(), line: z.string().optional(), start: quarter, end: quarter, state: z.enum(["built", "in_build", "planned"]) })).min(1),
      })
      .optional(),
    showreel: z
      .object({
        as_of: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "want YYYY-MM-DD"),
        lede: z.string(),
        orca: z.object({
          line: z.string(),
          demo: z.object({
            note: z.string(),
            question: z.string(),
            steps: z.array(z.string()).min(1),
            answer: z.string(),
            table: z.object({ head: z.array(z.string()), rows: z.array(z.array(z.string())) }),
            artefact: z.object({ name: z.string(), meta: z.string() }),
            stamp: z.string(),
          }),
          loop: z.array(z.object({ name: z.string(), line: z.string() })).min(2),
          loop_note: z.string(),
          capabilities: z.array(z.object({ name: z.string(), line: z.string() })).min(1),
          adoption: z.array(z.string()).min(1),
          lean: z.array(z.string()).min(1),
        }),
        platform: z.object({
          line: z.string(),
          eras: z.array(z.object({ year: z.string(), name: z.string(), line: z.string() })).min(2),
          measures: z.array(z.object({ name: z.string(), values: z.array(z.number().nullable()), labels: z.array(z.string()) })),
          measures_note: z.string(),
          scale: z.array(z.string()).min(1),
          money: z.array(z.object({ stopped: z.string(), instead: z.string(), amount: z.string(), state: z.string() })).min(1),
          money_note: z.string(),
        }),
        film: z
          .object({
            file: z.string(),
            poster: z.string(),
            credit: z.string(),
            adoption: z.array(FilmLine).min(1),
            lean: z.array(FilmLine).min(1),
            scale: z.array(FilmLine).min(1),
            close: z.string(),
          })
          .optional(),
      })
      .superRefine((s, ctx) => {
        const n = s.platform.eras.length;
        s.platform.measures.forEach((m, i) => {
          if (m.values.length !== n || m.labels.length !== n) {
            ctx.addIssue({ code: "custom", path: ["platform", "measures", i], message: `want ${n} values and labels, one per era` });
          }
        });
      })
      .optional(),
    pages: z.object({
      showreel: PageMeta.optional(),
      experience: PageMeta,
      projects: PageMeta,
      volunteering: PageMeta,
      education: PageMeta,
      github: PageMeta,
      resume: PageMeta,
    }),
  }),
});

export type Profile = z.infer<typeof Profile>;
export type Role = z.infer<typeof Role>;
export type Project = z.infer<typeof Project>;
export type Volunteering = z.infer<typeof Volunteering>;
export type Education = z.infer<typeof Education>;

if (raw.includes("—")) {
  throw new Error("profile.yaml contains an em dash");
}
const parsed = Profile.safeParse(parse(raw));
if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("\n");
  throw new Error(`profile.yaml failed validation:\n${issues}`);
}

export const profile: Profile = parsed.data;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function fmtMonth(value: string): string {
  if (value === "present") return "Present";
  const [year, m] = value.split("-");
  return `${MONTHS[Number(m) - 1]} ${year}`;
}

/** YYYY-MM to an ISO date for schema.org (first of the month). */
export function isoMonth(value: string): string | undefined {
  return value === "present" ? undefined : `${value}-01`;
}

export const featuredProjects = profile.site.featured_projects
  .map((name) => profile.projects.find((p) => p.name === name))
  .filter((p): p is Project => Boolean(p));

if (featuredProjects.length !== profile.site.featured_projects.length) {
  throw new Error("site.featured_projects names a project that does not exist");
}

/** URL slug for a name: "Data Marts Core" becomes "data-marts-core". Stills live at /stills/<slug>.webp. */
export function slug(name: string): string {
  return name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function stillFor(p: Project): string {
  return `/stills/${slug(p.name)}.webp`;
}

export function stillLightFor(p: Project): string {
  return `/stills/${slug(p.name)}-light.webp`;
}

/** Opening of a summary: whole sentences until the text is at least `min` characters long. */
export function opening(text: string, min = 70): string {
  const sentences = text.split(/(?<=\.)\s+/);
  let out = "";
  for (const s of sentences) {
    out = out ? `${out} ${s}` : s;
    if (out.length >= min) break;
  }
  return out;
}

/** The state a diagram node or workstream is drawn in. A node that names a project takes the project's status. */
export type BuildState = "built" | "in_build" | "planned";
const PROJECT_STATE: Record<Project["status"], BuildState> = { live: "built", in_progress: "in_build", paused: "planned", archived: "planned" };

export function nodeState(node: { project?: string; state?: BuildState }): BuildState {
  if (node.project) {
    const p = profile.projects.find((x) => x.name === node.project);
    if (!p) throw new Error(`ecosystem names a project that does not exist: ${node.project}`);
    return PROJECT_STATE[p.status];
  }
  return node.state ?? "built";
}

if (profile.site.ecosystem) {
  const ids = new Set(profile.site.ecosystem.nodes.map((n) => n.id));
  for (const e of profile.site.ecosystem.edges) {
    if (!ids.has(e.from) || !ids.has(e.to)) throw new Error(`ecosystem edge ${e.from} -> ${e.to} names an unknown node`);
  }
  profile.site.ecosystem.nodes.forEach(nodeState);
}
if (profile.site.roadmap && !profile.projects.some((p) => p.name === profile.site.roadmap?.project)) {
  throw new Error("site.roadmap.project names a project that does not exist");
}

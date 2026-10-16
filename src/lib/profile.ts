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
  linkedin_desc: z.string(),
});

const Project = z.object({
  name: z.string(),
  org: z.string(),
  venue: z.string(),
  period: z.string(),
  status: z.enum(["live", "in_progress", "paused", "archived"]),
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
    pages: z.object({
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

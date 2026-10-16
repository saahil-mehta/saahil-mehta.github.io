import type { APIRoute } from "astro";
import { profile } from "../lib/profile";

export const GET: APIRoute = () => {
  const { person, site, summaries } = profile;
  const lines = [
    `# ${person.name}`,
    "",
    `> ${summaries.cv}`,
    "",
    "Personal site. Every page is static HTML and readable without JavaScript.",
    "",
    "## Profile",
    "",
    `- [CV as Markdown](${site.url}/cv.md): full work history, projects, education and skills`,
    `- [JSON Resume](${site.url}/resume.json): the same data in JSON Resume v1 schema`,
    `- [Resume PDF](${site.url}/Saahil-Mehta-Resume.pdf)`,
    "",
    "## Pages",
    "",
    `- [Home](${site.url}/): summary, headline numbers, selected work`,
    `- [Experience](${site.url}/experience): ${site.pages.experience.description}`,
    `- [Projects](${site.url}/projects): ${site.pages.projects.description}`,
    `- [Volunteering](${site.url}/volunteering): ${site.pages.volunteering.description}`,
    `- [Education](${site.url}/education): ${site.pages.education.description}`,
    `- [GitHub activity](${site.url}/github)`,
    `- [Resume](${site.url}/resume)`,
    "",
    "## Contact",
    "",
    `- Email: ${person.email}`,
    `- LinkedIn: ${person.links.linkedin}`,
    `- GitHub: ${person.links.github}`,
    `- Book a call: ${person.links.calendly}`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};

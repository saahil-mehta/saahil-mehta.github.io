// Post-build checks on dist/. Fails the build when a page loses its title, description,
// canonical, single h1 or JSON-LD, when an internal link points nowhere, or when a
// machine endpoint is missing. Run with: npm run assert
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");
const failures = [];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

function count(html, re) {
  return (html.match(re) ?? []).length;
}

const pages = walk(dist).filter((f) => f.endsWith("index.html"));
if (pages.length < 7) failures.push(`expected at least 7 pages, found ${pages.length}`);

for (const file of pages) {
  const rel = relative(dist, file);
  const html = readFileSync(file, "utf8");
  if (count(html, /<h1[\s>]/g) !== 1) failures.push(`${rel}: expected exactly one <h1>`);
  if (!/<title>[^<]{5,}<\/title>/.test(html)) failures.push(`${rel}: missing <title>`);
  if (!/<meta name="description" content="[^"]{50,}"/.test(html)) failures.push(`${rel}: missing or short meta description`);
  if (!/<link rel="canonical" href="https:\/\/saahil\.co\.uk[^"]*"/.test(html)) failures.push(`${rel}: missing canonical`);
  if (!/<meta property="og:image" content="https:\/\/saahil\.co\.uk\/og\.png"/.test(html)) failures.push(`${rel}: missing og:image`);
  if (/—/.test(html)) failures.push(`${rel}: contains an em dash`);
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (ld.length === 0) failures.push(`${rel}: no JSON-LD`);
  for (const [, body] of ld) {
    try {
      const obj = JSON.parse(body);
      if (!obj["@type"]) failures.push(`${rel}: JSON-LD without @type`);
    } catch (err) {
      failures.push(`${rel}: JSON-LD does not parse (${err.message})`);
    }
  }
  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const target = href.endsWith("/") ? join(dist, href, "index.html") : join(dist, href);
    const ok = existsSync(target) || existsSync(join(dist, href, "index.html"));
    if (!ok) failures.push(`${rel}: link to ${href} resolves to nothing in dist/`);
  }
}

for (const path of ["llms.txt", "cv.md", "resume.json", "sitemap-index.xml", "robots.txt", "og.png", "CNAME", "vendor/lottie-player.js"]) {
  if (!existsSync(join(dist, path))) failures.push(`missing dist/${path}`);
}
if (existsSync(join(dist, "resume.json"))) {
  try {
    const resume = JSON.parse(readFileSync(join(dist, "resume.json"), "utf8"));
    if (!resume.basics?.name || !Array.isArray(resume.work) || resume.work.length < 5) failures.push("resume.json: unexpected shape");
  } catch (err) {
    failures.push(`resume.json does not parse (${err.message})`);
  }
}
if (existsSync(join(dist, "cv.md")) && !/^# Saahil Mehta/m.test(readFileSync(join(dist, "cv.md"), "utf8"))) {
  failures.push("cv.md: unexpected content");
}

if (failures.length) {
  console.error(`assert-html: ${failures.length} problem(s)`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`assert-html: ${pages.length} pages and all endpoints look right`);

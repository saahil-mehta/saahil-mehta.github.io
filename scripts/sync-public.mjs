// Build-time inputs the static site needs before Astro runs:
// - profile/out/cv.md -> public/cv.md        (the Rezi paste, rendered by scripts/render_profile.py)
// - src/generated/*.svg and public/diagrams/*.svg, rendered from profile.yaml by scripts/make_diagrams.py
//   (set PYTHON to the interpreter that has pyyaml, fonttools and brotli; default python3)
import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const copies = [
  ["profile/out/cv.md", "public/cv.md"],
];

for (const [from, to] of copies) {
  const src = join(root, from);
  if (!existsSync(src)) {
    console.error(`sync-public: missing ${from}`);
    process.exit(1);
  }
  mkdirSync(dirname(join(root, to)), { recursive: true });
  copyFileSync(src, join(root, to));
  console.log(`synced ${from} -> ${to}`);
}

const python = process.env.PYTHON ?? "python3";
const render = spawnSync(python, [join(root, "scripts/make_diagrams.py")], { stdio: "inherit" });
if (render.status !== 0) {
  console.error(`sync-public: ${python} scripts/make_diagrams.py failed`);
  process.exit(render.status ?? 1);
}

// Copies build-time inputs into public/ so the static site serves them as-is:
// - profile/out/cv.md -> public/cv.md        (the Rezi paste, rendered by scripts/render_profile.py)
// - the pinned Lottie player -> public/vendor (served locally instead of unpkg@latest)
import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const copies = [
  ["profile/out/cv.md", "public/cv.md"],
  ["node_modules/@lottiefiles/lottie-player/dist/lottie-player.js", "public/vendor/lottie-player.js"],
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

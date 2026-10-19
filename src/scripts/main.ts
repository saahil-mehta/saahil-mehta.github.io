// Single entry point. Each init is idempotent and re-runs after every view transition.
import { initMenu } from "./menu";
import { initTheme } from "./theme";
import { initCopy } from "./copy";
import { initArrive } from "./arrive";
import { initParallax } from "./parallax";
import { initProgress } from "./progress";
import { initContributions } from "./contributions";
import { initTilt } from "./tilt";

function initAll(): void {
  initMenu();
  initTheme();
  initCopy();
  initArrive();
  initParallax();
  initProgress();
  initTilt();
  void initContributions();
}

document.addEventListener("astro:page-load", initAll);

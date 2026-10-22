// Single entry point. Each init is idempotent and re-runs after every view transition.
import { initMenu } from "./menu";
import { initTheme } from "./theme";
import { initCopy } from "./copy";
import { initArrive } from "./arrive";
import { initParallax } from "./parallax";
import { initProgress } from "./progress";
import { initContributions } from "./contributions";
import { initTilt } from "./tilt";
import { initObjects } from "./objects3d";

function initAll(): void {
  initMenu();
  initTheme();
  initCopy();
  initArrive();
  initParallax();
  initProgress();
  initTilt();
  void initContributions();
  // The 3D objects load after the page has settled, so they never compete with first paint.
  const later = (window as unknown as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 400));
  later(() => void initObjects().catch(() => undefined));
}

document.addEventListener("astro:page-load", initAll);

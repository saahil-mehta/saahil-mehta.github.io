// Single entry point. Each init is idempotent and re-runs after every view transition.
import { initTheme } from "./theme";
import { initMenu } from "./menu";
import { initSweep } from "./sweep";
import { initCopy } from "./copy";
import { initEasterEggs } from "./easter-eggs";
import { initContributions } from "./contributions";

function initAll(): void {
  initTheme();
  initMenu();
  initEasterEggs();
  initSweep();
  initCopy();
  void initContributions();
}

document.addEventListener("astro:page-load", initAll);

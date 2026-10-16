// Single entry point. Each init is idempotent and re-runs after every view transition.
import { initTheme } from "./theme";
import { initMenu } from "./menu";
import { initReveal } from "./reveal";
import { initCountUp } from "./countup";
import { initPointerGlow } from "./pointer-glow";
import { initEasterEggs } from "./easter-eggs";
import { initContributions } from "./contributions";
import { initLottie } from "./lottie";

function initAll(): void {
  initTheme();
  initMenu();
  initEasterEggs();
  initReveal();
  initCountUp();
  initPointerGlow();
  void initContributions();
  initLottie();
}

document.addEventListener("astro:page-load", initAll);

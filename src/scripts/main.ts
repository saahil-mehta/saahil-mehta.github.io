// Single entry point. Each init is idempotent and re-runs after every view transition.
import { initMenu } from "./menu";
import { initPrintRun } from "./print-run";
import { initCopy } from "./copy";
import { initEasterEggs } from "./easter-eggs";
import { initContributions } from "./contributions";

function initAll(): void {
  initMenu();
  initEasterEggs();
  initCopy();
  void initContributions();
  initPrintRun();
}

document.addEventListener("astro:page-load", initAll);
// A swapped-in page arrives unprinted; the passes run again for the new sheet.
document.addEventListener("astro:after-swap", () => document.body.classList.remove("printed"));

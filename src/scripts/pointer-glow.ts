// The hero glow follows the pointer while it is over the hero, then returns to its slow
// ambient drift. Skipped on touch devices and under reduced motion.
export function initPointerGlow(): void {
  const hero = document.querySelector<HTMLElement>(".hero");
  if (!hero || hero.dataset.bound) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (matchMedia("(hover: none)").matches) return;
  hero.dataset.bound = "1";

  let idleTimer: number | undefined;
  hero.addEventListener("pointermove", (e) => {
    const rect = hero.getBoundingClientRect();
    const glow = hero.querySelector<HTMLElement>(".hero-glow");
    if (!glow) return;
    // The disc is 560px and offset (-6rem, -8rem) from the hero's corner; centre it on the pointer.
    const x = e.clientX - rect.left + 96 - 280;
    const y = e.clientY - rect.top + 128 - 280;
    glow.style.setProperty("--gx", `${x.toFixed(0)}px`);
    glow.style.setProperty("--gy", `${y.toFixed(0)}px`);
    hero.classList.add("is-tracking");
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => hero.classList.remove("is-tracking"), 1800);
  });
  hero.addEventListener("pointerleave", () => {
    window.clearTimeout(idleTimer);
    hero.classList.remove("is-tracking");
    const glow = hero.querySelector<HTMLElement>(".hero-glow");
    glow?.style.removeProperty("--gx");
    glow?.style.removeProperty("--gy");
  });
}

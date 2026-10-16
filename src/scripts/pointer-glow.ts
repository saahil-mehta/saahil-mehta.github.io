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
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    hero.style.setProperty("--mx", `${mx.toFixed(1)}%`);
    hero.style.setProperty("--my", `${my.toFixed(1)}%`);
    hero.classList.add("is-tracking");
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => hero.classList.remove("is-tracking"), 1800);
  });
  hero.addEventListener("pointerleave", () => {
    window.clearTimeout(idleTimer);
    hero.classList.remove("is-tracking");
    hero.style.removeProperty("--mx");
    hero.style.removeProperty("--my");
  });
}

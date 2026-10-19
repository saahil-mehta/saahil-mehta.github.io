// Progress hairline fallback for browsers without scroll-driven animations.
let bound = false;
export function initProgress(): void {
  if (bound) return;
  if (CSS.supports("animation-timeline: scroll()")) return;
  bound = true;
  const bar = document.querySelector<HTMLElement>(".progress");
  if (!bar) return;
  let raf = 0;
  const update = () => {
    raf = 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty("--progress", max > 0 ? String(window.scrollY / max) : "0");
  };
  window.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
  update();
}

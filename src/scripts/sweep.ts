// The one authored entry moment: production strips sweep in when they scroll into view.
// CSS hides the "on" cells only under html.js and no reduced-motion preference, so the
// strips are complete without this script.
export function initSweep(): void {
  const strips = document.querySelectorAll<HTMLElement>(".strip:not(.is-swept)");
  if (strips.length === 0) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    strips.forEach((s) => s.classList.add("is-swept"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-swept");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.2 },
  );
  strips.forEach((s) => observer.observe(s));
}

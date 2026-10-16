// Scroll reveal for [data-reveal]. CSS hides these only when html.js is set and the user
// has no reduced-motion preference, so content is always visible without this script.
export function initReveal(): void {
  const items = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)");
  if (items.length === 0) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.classList.add("is-visible");
        el.dispatchEvent(new CustomEvent("reveal"));
        observer.unobserve(el);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
  );
  items.forEach((el) => observer.observe(el));
}

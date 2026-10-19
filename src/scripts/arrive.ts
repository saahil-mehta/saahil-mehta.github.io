// The arrival. Each [data-arrive] group settles once when a fifth of it is in view; its
// children stagger by their --i. Without JavaScript the page is already settled (CSS).
let observer: IntersectionObserver | null = null;

function reveal(el: Element): void {
  el.classList.add("in");
}

export function initArrive(): void {
  const groups = document.querySelectorAll<HTMLElement>("[data-arrive]:not(.in)");
  if (groups.length === 0) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !("IntersectionObserver" in window)) {
    groups.forEach(reveal);
    return;
  }
  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        reveal(entry.target);
        observer?.unobserve(entry.target);
      }
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
  );
  groups.forEach((g) => {
    // Anything already above the fold at load settles immediately so nothing reads as missing.
    const r = g.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.9) reveal(g);
    else observer?.observe(g);
  });
}

// Count-up for [data-count]. The element is server-rendered with its final text, so
// without JavaScript or with reduced motion the number is simply there.
const formatter = new Intl.NumberFormat("en-GB");

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function run(el: HTMLElement): void {
  const target = Number(el.dataset.count);
  if (!Number.isFinite(target)) return;
  const prefix = el.dataset.prefix ?? "";
  const suffix = el.dataset.suffix ?? "";
  const duration = 1200;
  const start = performance.now();
  const frame = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const value = Math.round(target * easeOut(t));
    el.textContent = `${prefix}${formatter.format(value)}${suffix}`;
    if (t < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

export function initCountUp(): void {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
    if (el.dataset.counted) return;
    el.dataset.counted = "1";
    const host = el.closest<HTMLElement>("[data-reveal]");
    if (host && !host.classList.contains("is-visible")) {
      host.addEventListener("reveal", () => run(el), { once: true });
    } else {
      run(el);
    }
  });
}

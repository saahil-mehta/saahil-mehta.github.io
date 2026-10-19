// Stills lean a few degrees toward the cursor while it is over their row, pointer devices only.
export function initTilt(): void {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll<HTMLElement>(".still-row").forEach((row) => {
    if (row.dataset.tilt) return;
    row.dataset.tilt = "1";
    const img = row.querySelector<HTMLElement>(".still img");
    if (!img) return;
    row.addEventListener("pointermove", (e) => {
      const r = img.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / r.width;
      const y = (e.clientY - (r.top + r.height / 2)) / r.height;
      img.style.setProperty("--ry", `${(Math.max(-1, Math.min(1, x)) * 5).toFixed(2)}deg`);
      img.style.setProperty("--rx", `${(Math.max(-1, Math.min(1, -y)) * 5).toFixed(2)}deg`);
    }, { passive: true });
    row.addEventListener("pointerleave", () => {
      img.style.removeProperty("--rx");
      img.style.removeProperty("--ry");
    });
  });
}

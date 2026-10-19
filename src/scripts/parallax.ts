// Cursor parallax on the portrait: a few pixels, eased each frame, pointer devices only.
export function initParallax(): void {
  const frame = document.querySelector<HTMLElement>("[data-parallax]");
  if (!frame || frame.dataset.bound) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  frame.dataset.bound = "1";
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
  const tick = () => {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    frame.style.setProperty("--px", `${cx.toFixed(2)}px`);
    frame.style.setProperty("--py", `${cy.toFixed(2)}px`);
    if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) raf = requestAnimationFrame(tick);
    else raf = 0;
  };
  const onMove = (e: PointerEvent) => {
    const r = frame.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
    const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
    tx = Math.max(-1, Math.min(1, dx)) * -8;
    ty = Math.max(-1, Math.min(1, dy)) * -8;
    if (!raf) raf = requestAnimationFrame(tick);
  };
  window.addEventListener("pointermove", onMove, { passive: true });
}

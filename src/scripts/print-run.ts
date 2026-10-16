// The one authored entry moment: the red and green ink passes land after the night ink,
// each settling from a registration offset. Without JavaScript every ink is already
// printed, because the hidden state is gated on html.js.
export function initPrintRun(): void {
  const body = document.body;
  if (body.classList.contains("printed")) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    body.classList.add("printed");
    return;
  }
  // Two frames so the initial offset state is painted before the passes transition in.
  requestAnimationFrame(() => requestAnimationFrame(() => body.classList.add("printed")));
}

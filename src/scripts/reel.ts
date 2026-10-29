// The showreel. The Orca reconstruction plays once when it comes into view and can be played
// again; the chapter bar follows the scene that crosses the middle of the window. Both are
// no-ops on other pages. Without script the exchange is already finished and the bar is a
// plain list of links.
let onScroll: (() => void) | null = null;
let demoObserver: IntersectionObserver | null = null;

function initDemo(): void {
  const demo = document.querySelector<HTMLElement>("[data-demo]");
  if (!demo || demo.classList.contains("armed")) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  const replay = demo.querySelector<HTMLButtonElement>(".demo-replay");
  const play = () => {
    // Focus waits on the figure while the button is hidden, and returns when it reappears.
    if (replay && document.activeElement === replay) demo.focus({ preventScroll: true });
    if (replay) replay.hidden = true;
    demo.classList.remove("play");
    void demo.offsetWidth; // restart the CSS timeline
    demo.classList.add("play");
  };
  demo.classList.add("armed");
  demo.querySelector(".demo-stamp")?.addEventListener("animationend", () => {
    if (!replay) return;
    replay.hidden = false;
    if (document.activeElement === demo) replay.focus({ preventScroll: true });
  });
  replay?.addEventListener("click", play);
  demoObserver?.disconnect();
  demoObserver = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      play();
      demoObserver?.disconnect();
    },
    { threshold: 0.35 },
  );
  demoObserver.observe(demo);
}

function initChapters(): void {
  if (onScroll) {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    onScroll = null;
  }
  const bar = document.querySelector<HTMLElement>(".reel-bar");
  if (!bar) return;
  const ticks = [...bar.querySelectorAll<HTMLAnchorElement>("[data-tick]")];
  const scenes = ticks.map((t) => document.getElementById(t.dataset.tick ?? ""));
  const count = bar.querySelector<HTMLElement>(".reel-n");
  const label = bar.querySelector<HTMLElement>(".reel-label");
  const name = (i: number) => ticks[i].querySelector(".sr-only")?.textContent ?? "";
  let current = 0;
  const say = (i: number) => {
    if (count) count.textContent = String(i + 1);
    if (label) label.textContent = name(i);
  };
  // The scene in view is the last one whose top has passed the middle of the window.
  const update = () => {
    let at = 0;
    scenes.forEach((s, i) => {
      if (s && s.getBoundingClientRect().top <= window.innerHeight / 2) at = i;
    });
    current = at;
    ticks.forEach((t, i) => {
      if (i === at) t.setAttribute("aria-current", "step");
      else t.removeAttribute("aria-current");
      t.classList.toggle("seen", i < at);
    });
    say(at);
  };
  let raf = 0;
  onScroll = () => {
    if (!raf) raf = requestAnimationFrame(() => ((raf = 0), update()));
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  // A hovered or focused tick names its scene in the bar, and the bar returns to the scene in view after.
  ticks.forEach((t, i) => {
    const preview = () => say(i);
    const restore = () => say(current);
    t.addEventListener("pointerenter", preview);
    t.addEventListener("focus", preview);
    t.addEventListener("pointerleave", restore);
    t.addEventListener("blur", restore);
  });
  update();
}

export function initReel(): void {
  initDemo();
  initChapters();
}

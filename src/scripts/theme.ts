// Colour scheme: follows the system until the visitor chooses; the choice is stored.
// Stills ship a light-ground plate through <picture>; a stored choice overrides the media query.
function applyStillSources(): void {
  const forced = document.documentElement.getAttribute("data-theme");
  const media = forced === "light" ? "all" : forced === "dark" ? "not all" : "(prefers-color-scheme: light)";
  document.querySelectorAll<HTMLSourceElement>("source[data-still-light]").forEach((source) => {
    if (source.media !== media) source.media = media;
  });
}

export function initTheme(): void {
  applyStillSources();
  const button = document.getElementById("theme-toggle");
  if (!button || button.dataset.bound) return;
  button.dataset.bound = "1";
  button.addEventListener("click", () => {
    const root = document.documentElement;
    const systemLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const current = root.getAttribute("data-theme") ?? (systemLight ? "light" : "dark");
    const next = current === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* ignore */
    }
    applyStillSources();
  });
}

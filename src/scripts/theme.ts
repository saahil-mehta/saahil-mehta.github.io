// Colour scheme: follows the system until the visitor chooses; the choice is stored.
export function initTheme(): void {
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
  });
}

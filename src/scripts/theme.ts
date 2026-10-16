// Theme toggle. The no-flash inline script in Base.astro sets data-theme before paint;
// this module keeps the toggle, the shortcut and persistence working across view transitions.
type Theme = "light" | "dark";

function read(): Theme {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    /* storage blocked */
  }
  return "light";
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("theme", theme);
  } catch {
    /* storage blocked */
  }
  const button = document.getElementById("theme-toggle");
  button?.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
}

function toggle(): void {
  applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
}

let shortcutBound = false;

export function initTheme(): void {
  applyTheme(read());
  const button = document.getElementById("theme-toggle");
  if (button && !button.dataset.bound) {
    button.dataset.bound = "1";
    button.addEventListener("click", toggle);
  }
  if (!shortcutBound) {
    shortcutBound = true;
    document.addEventListener("keydown", (e) => {
      if (e.key === "t" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        toggle();
      }
    });
    // The ClientRouter swaps <html> attributes from the incoming page; reapply the saved theme.
    document.addEventListener("astro:after-swap", () => applyTheme(read()));
  }
}

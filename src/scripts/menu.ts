// Mobile navigation overlay.
let open = false;

function setOpen(next: boolean): void {
  open = next;
  const header = document.getElementById("main-header");
  const button = document.getElementById("toggle-navigation-menu");
  header?.classList.toggle("menu-open", open);
  document.body.classList.toggle("menu-open", open);
  button?.setAttribute("aria-expanded", String(open));
}

let globalBound = false;

export function initMenu(): void {
  setOpen(false);
  const button = document.getElementById("toggle-navigation-menu");
  if (button && !button.dataset.bound) {
    button.dataset.bound = "1";
    button.addEventListener("click", () => setOpen(!open));
  }
  document.querySelectorAll<HTMLAnchorElement>("#navigation-menu a").forEach((a) => {
    if (a.dataset.bound) return;
    a.dataset.bound = "1";
    a.addEventListener("click", () => setOpen(false));
  });
  if (!globalBound) {
    globalBound = true;
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && open) setOpen(false);
    });
    document.addEventListener("click", (e) => {
      if (open && !(e.target as Element).closest("#main-header")) setOpen(false);
    });
  }
}

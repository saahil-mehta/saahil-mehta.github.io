// Copy-to-clipboard buttons ([data-copy]). Falls back to opening mailto: when the
// clipboard is unavailable, so the control always does something useful.
export function initCopy(): void {
  document.querySelectorAll<HTMLButtonElement>("button[data-copy]").forEach((button) => {
    if (button.dataset.bound) return;
    button.dataset.bound = "1";
    button.addEventListener("click", async () => {
      const value = button.dataset.copy ?? "";
      try {
        await navigator.clipboard.writeText(value);
        button.dataset.copied = "true";
        window.setTimeout(() => {
          delete button.dataset.copied;
        }, 1800);
      } catch {
        location.href = `mailto:${value}`;
      }
    });
  });
}

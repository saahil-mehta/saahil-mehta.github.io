// Minimal rich text for profile.yaml prose: paragraphs split on blank lines, markdown links
// converted, everything else escaped. The YAML is first-party, this keeps the output tidy.
function escape(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function inline(text: string): string {
  return escape(text).replace(
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
    (_m, label: string, href: string) =>
      `<a href="${href}" class="cactus-link" target="_blank" rel="noopener">${label}</a>`,
  );
}

export function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(inline);
}

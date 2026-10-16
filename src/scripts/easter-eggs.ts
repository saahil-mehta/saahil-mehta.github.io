// Carried over from the first site: every b/B turns yellow on hover and releases a bee
// when clicked; the logo throws a party. Both respect reduced motion.
import { navigate } from "astro:transitions/client";

function wrapLetters(root: Element): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const value = node.nodeValue ?? "";
      if (!/[bB]/.test(value)) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "BUTTON", "SUMMARY", "TIME", "CODE"].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent.classList.contains("hover-b")) return NodeFilter.FILTER_REJECT;
      if (parent.closest(".pill, .button, .tags, .label, .mono, .strip-caption, .release-tag, .site-nav, .brand, .banner-meta, .integrations")) return NodeFilter.FILTER_REJECT;
      // Splitting a text node that is itself a flex or grid item turns one word into several items.
      const display = getComputedStyle(parent).display;
      if (display.includes("flex") || display.includes("grid")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) nodes.push(n as Text);
  for (const textNode of nodes) {
    const fragment = document.createDocumentFragment();
    let buffer = "";
    for (const ch of textNode.nodeValue ?? "") {
      if (ch === "b" || ch === "B") {
        if (buffer) fragment.appendChild(document.createTextNode(buffer));
        buffer = "";
        const span = document.createElement("span");
        span.className = "hover-b";
        span.textContent = ch;
        fragment.appendChild(span);
      } else {
        buffer += ch;
      }
    }
    if (buffer) fragment.appendChild(document.createTextNode(buffer));
    textNode.parentNode?.replaceChild(fragment, textNode);
  }
}

function spawnBee(from: Element): void {
  const rect = from.getBoundingClientRect();
  const bee = document.createElement("div");
  bee.className = "flying-bee";
  bee.textContent = "🐝";
  bee.style.left = `${rect.left + rect.width / 2}px`;
  bee.style.top = `${rect.top + rect.height / 2}px`;
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.max(innerWidth, innerHeight) + 200;
  bee.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
  bee.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
  document.body.appendChild(bee);
  const cleanup = () => bee.remove();
  bee.addEventListener("animationend", cleanup, { once: true });
  setTimeout(cleanup, 4000);
}

const HAT_COLOURS = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3", "#54a0ff", "#5f27cd"];

function hatSvg(colour: string): string {
  return `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><polygon points="20,2 34,36 6,36" fill="${colour}"/><circle cx="20" cy="4" r="3.5" fill="#fff"/><circle cx="14" cy="30" r="1.6" fill="#fff" opacity=".8"/><circle cx="24" cy="24" r="1.6" fill="#fff" opacity=".8"/></svg>`;
}

function party(origin: Element): void {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  origin.classList.add("logo-party-pulse");
  setTimeout(() => origin.classList.remove("logo-party-pulse"), 600);
  if (reduced) return;
  const rect = origin.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  for (let i = 0; i < 12; i++) {
    const hat = document.createElement("div");
    hat.className = "party-hat";
    hat.innerHTML = hatSvg(HAT_COLOURS[i % HAT_COLOURS.length]);
    const angle = ((360 / 12) * i * Math.PI) / 180;
    const distance = 150 + Math.random() * 100;
    hat.style.left = `${cx}px`;
    hat.style.top = `${cy}px`;
    document.body.appendChild(hat);
    setTimeout(() => {
      hat.classList.add("exploding");
      hat.style.transition = "left 2s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      hat.style.left = `${cx + Math.cos(angle) * distance}px`;
      hat.style.top = `${cy + Math.sin(angle) * distance}px`;
    }, i * 50);
    setTimeout(() => hat.remove(), 2500);
  }
  for (let i = 0; i < 20; i++) {
    const sparkle = document.createElement("div");
    sparkle.className = "party-sparkle";
    sparkle.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 120;
    sparkle.style.left = `${cx}px`;
    sparkle.style.top = `${cy}px`;
    document.body.appendChild(sparkle);
    setTimeout(() => {
      sparkle.classList.add("exploding");
      sparkle.style.transition = "left 1.5s ease-out, top 1.5s ease-out";
      sparkle.style.left = `${cx + Math.cos(angle) * distance}px`;
      sparkle.style.top = `${cy + Math.sin(angle) * distance}px`;
    }, i * 30);
    setTimeout(() => sparkle.remove(), 2000);
  }
}

let globalBound = false;

export function initEasterEggs(): void {
  const main = document.querySelector("main");
  if (main) wrapLetters(main);
  const logo = document.querySelector<HTMLAnchorElement>(".brand");
  if (logo && !logo.dataset.bound) {
    logo.dataset.bound = "1";
    logo.addEventListener("click", (e) => {
      e.preventDefault();
      party(logo);
      if (location.pathname !== "/") setTimeout(() => navigate("/"), 450);
    });
  }
  if (!globalBound) {
    globalBound = true;
    document.addEventListener("click", (e) => {
      const target = e.target as Element | null;
      if (target?.classList.contains("hover-b")) spawnBee(target);
    });
  }
}

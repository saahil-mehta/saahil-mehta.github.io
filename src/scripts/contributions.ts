// GitHub contribution calendar for the last twelve months, fetched client-side and cached
// for an hour. The API has no auth and returns public data only.
type Day = { date: string; count: number };
type Week = { days: Day[] };
type Cache = { contributions: Day[]; fetchTime: number };

const USERNAME = "saahil-mehta";
const CACHE_KEY = `github-contrib-${USERNAME}-v2`;
const CACHE_TTL = 60 * 60 * 1000;

function readCache(): Cache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Cache;
    if (Date.now() - data.fetchTime < CACHE_TTL) return data;
    localStorage.removeItem(CACHE_KEY);
  } catch {
    /* ignore */
  }
  return null;
}

function writeCache(data: Cache): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

function toWeeks(contributions: Day[]): Week[] {
  const byDate = new Map(contributions.map((c) => [c.date, c.count || 0]));
  const start = new Date();
  start.setFullYear(start.getFullYear() - 1);
  if (start.getDay() !== 0) start.setDate(start.getDate() + (7 - start.getDay()));
  const today = new Date().toISOString().slice(0, 10);
  const weeks: Week[] = [];
  const cursor = new Date(start);
  while (cursor.toISOString().slice(0, 10) <= today) {
    const week: Week = { days: [] };
    for (let i = 0; i < 7; i++) {
      const date = cursor.toISOString().slice(0, 10);
      if (date > today) break;
      week.days.push({ date, count: byDate.get(date) ?? 0 });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function level(count: number): string {
  if (count === 0) return "";
  if (count < 3) return "l1";
  if (count < 6) return "l2";
  if (count < 10) return "l3";
  return "l4";
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function fmt(date: string): string {
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function render(container: HTMLElement, weeks: Week[]): void {
  container.innerHTML = "";
  const total = weeks.reduce((sum, w) => sum + w.days.reduce((s, d) => s + d.count, 0), 0);
  const first = weeks[0]?.days[0]?.date ?? "";
  const last = weeks.at(-1)?.days.at(-1)?.date ?? "";

  const scroll = el("div", "field-wrap");
  const field = el("div", "field wave");
  field.setAttribute("role", "img");
  field.setAttribute("aria-label", `${total.toLocaleString("en-GB")} contributions on GitHub between ${fmt(first)} and ${fmt(last)}`);
  weeks.forEach((week, wi) => {
    const column = el("div", "field-week");
    for (const day of week.days) {
      const cell = el("span", `cell ${level(day.count)}`.trim());
      cell.style.setProperty("--i", String(wi));
      cell.dataset.label = `${day.count} contribution${day.count === 1 ? "" : "s"} on ${fmt(day.date)}`;
      column.appendChild(cell);
    }
    field.appendChild(column);
  });
  scroll.appendChild(field);
  container.appendChild(scroll);

  const foot = el("div", "field-foot");
  foot.appendChild(el("span", "credit num", `${total.toLocaleString("en-GB")} contributions · ${fmt(first)} to ${fmt(last)}`));
  const legend = el("span", "legend credit");
  legend.appendChild(el("span", "", "Less"));
  for (const l of ["", "l1", "l2", "l3", "l4"]) legend.appendChild(el("span", `cell ${l}`.trim()));
  legend.appendChild(el("span", "", "More"));
  foot.appendChild(legend);
  container.appendChild(foot);

  // The wave runs once the field is in view; above the fold it runs now.
  const start = () => field.classList.add("in");
  if (!("IntersectionObserver" in window) || field.getBoundingClientRect().top < window.innerHeight) {
    requestAnimationFrame(start);
    return;
  }
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      start();
      io.disconnect();
    }
  }, { threshold: 0.2 });
  io.observe(field);
}

export async function initContributions(): Promise<void> {
  const container = document.getElementById("github-contributions");
  if (!container || container.dataset.loaded) return;
  container.dataset.loaded = "1";
  const cached = readCache();
  if (cached) {
    render(container, toWeeks(cached.contributions));
    return;
  }
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}`);
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as { contributions: Day[] };
    writeCache({ contributions: data.contributions, fetchTime: Date.now() });
    render(container, toWeeks(data.contributions));
  } catch {
    container.innerHTML = "";
    const p = el("p", "field-loading");
    p.append("Commits could not be loaded right now. ");
    const a = el("a", "link", "See them on GitHub");
    a.href = `https://github.com/${USERNAME}`;
    a.target = "_blank";
    a.rel = "noopener";
    p.appendChild(a);
    p.append(".");
    container.appendChild(p);
  }
}

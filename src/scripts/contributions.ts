// GitHub contribution calendar for the last twelve months, fetched client-side and cached
// for an hour. Ported from the first site; the API has no auth and returns public data only.
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
  const end = new Date();
  const weeks: Week[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    const week: Week = { days: [] };
    for (let i = 0; i < 7; i++) {
      const date = cursor.toISOString().slice(0, 10);
      week.days.push({ date, count: byDate.get(date) ?? 0 });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function level(count: number): string {
  if (count === 0) return "level-0";
  if (count < 3) return "level-1";
  if (count < 6) return "level-2";
  if (count < 10) return "level-3";
  return "level-4";
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function render(container: HTMLElement, weeks: Week[]): void {
  container.innerHTML = "";
  const total = weeks.reduce((sum, w) => sum + w.days.reduce((s, d) => s + d.count, 0), 0);
  container.appendChild(el("div", "contrib-total", `${total.toLocaleString("en-GB")} contributions in the last year`));

  const scroll = el("div", "contrib-scroll");
  const months = el("div", "contrib-months");
  let current = "";
  let startIndex = 0;
  weeks.forEach((week, i) => {
    const name = new Date(week.days[0].date).toLocaleDateString("en-GB", { month: "short" });
    if (i === 0) {
      current = name;
    } else if (name !== current) {
      // Three columns is the narrowest a three-letter label fits over at the grid's 480px floor.
      if (i - startIndex >= 3) {
        const label = el("span", "contrib-month-label", current);
        label.style.left = `${(startIndex / weeks.length) * 100}%`;
        months.appendChild(label);
      }
      startIndex = i;
      current = name;
    }
  });
  if (weeks.length - startIndex >= 1) {
    const label = el("span", "contrib-month-label", current);
    // A month with under three weeks showing is pinned to the right edge so its text
    // stays inside the grid rather than hanging past the last column.
    if (weeks.length - startIndex < 3) label.style.right = "0";
    else label.style.left = `${(startIndex / weeks.length) * 100}%`;
    months.appendChild(label);
  }
  scroll.appendChild(months);

  const graph = el("div", "contrib-graph-container");
  const weekdays = el("div", "contrib-weekdays");
  for (const d of ["Mon", "", "Wed", "", "Fri", "", ""]) weekdays.appendChild(el("span", "contrib-weekday-label", d));
  graph.appendChild(weekdays);

  const grid = el("div", "contrib-grid");
  for (const week of weeks) {
    const column = el("div", "contrib-week");
    for (const day of week.days) {
      const cell = el("span", `contrib-day ${level(day.count)}`);
      cell.dataset.label = `${day.count} contribution${day.count === 1 ? "" : "s"} · ${day.date}`;
      cell.setAttribute("role", "img");
      cell.setAttribute("aria-label", cell.dataset.label);
      column.appendChild(cell);
    }
    grid.appendChild(column);
  }
  graph.appendChild(grid);
  scroll.appendChild(graph);
  container.appendChild(scroll);

  const legend = el("div", "contrib-legend");
  legend.appendChild(el("span", "contrib-legend-label", "Less"));
  const swatches = el("div", "contrib-legend-swatches");
  for (let l = 0; l <= 4; l++) swatches.appendChild(el("span", `contrib-day level-${l}`));
  legend.appendChild(swatches);
  legend.appendChild(el("span", "contrib-legend-label", "More"));
  container.appendChild(legend);
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
    const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = (await response.json()) as { contributions?: Day[] };
    if (!Array.isArray(data.contributions)) throw new Error("unexpected format");
    const cache = { contributions: data.contributions, fetchTime: Date.now() };
    writeCache(cache);
    render(container, toWeeks(cache.contributions));
  } catch {
    container.innerHTML = '<p class="contrib-note">Unable to load contributions right now. The activity is on GitHub.</p>';
  }
}

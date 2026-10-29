// Month arithmetic for the production strips. All inputs are YYYY-MM strings from profile.yaml;
// "now" is the build month, so the strips are as fresh as the last deploy.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const BUILD_DATE = new Date();
export const BUILD_MONTH = `${BUILD_DATE.getUTCFullYear()}-${String(BUILD_DATE.getUTCMonth() + 1).padStart(2, "0")}`;

export function toIndex(ym: string): number {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
}

export function fromIndex(i: number): string {
  return `${Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, "0")}`;
}

export function fmtMonth(ym: string): string {
  if (ym === "present") return "Present";
  const [y, m] = ym.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

/** A YYYY-MM-DD date as "26 Oct 2026". */
export function fmtDay(ymd: string): string {
  const [y, m, d] = ymd.split("-");
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
}

/** Whole months from `since` to `until` (or the build month), inclusive of the start month. */
export function monthsInProduction(since: string, until: string | null): number {
  return Math.max(1, toIndex(until ?? BUILD_MONTH) - toIndex(since) + 1);
}

export function durationLabel(since: string, until: string | null): string {
  const n = monthsInProduction(since, until);
  if (n < 12) return `${n} month${n === 1 ? "" : "s"}`;
  const years = Math.floor(n / 12);
  const rest = n % 12;
  const y = `${years} year${years === 1 ? "" : "s"}`;
  return rest ? `${y} ${rest} mo` : y;
}

export type StripCell = { ym: string; on: boolean; label: string };

/** The last `window` months ending at the build month; a cell is on while the system was in production. */
export function stripCells(since: string, until: string | null, window = 36): StripCell[] {
  const end = toIndex(BUILD_MONTH);
  const start = toIndex(since);
  const stop = toIndex(until ?? BUILD_MONTH);
  const cells: StripCell[] = [];
  for (let i = end - window + 1; i <= end; i++) {
    const ym = fromIndex(i);
    cells.push({ ym, on: i >= start && i <= stop, label: fmtMonth(ym) });
  }
  return cells;
}

export function buildTimestamp(): string {
  return BUILD_DATE.toISOString().slice(0, 16).replace("T", " ") + " UTC";
}

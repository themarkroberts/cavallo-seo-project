import type { GscPage, GscStats, PageRow } from "./types.ts";

/**
 * Search Console reports the same page under several spellings — with and
 * without a trailing slash, and `www.` as a separate property from the bare
 * domain. Normalise both sides before matching or the join silently misses.
 */
export function normaliseUrl(url: string): string {
  return url
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/+$/, "");
}

/** Index GSC rows by normalised URL, summing rows that collapse together. */
export function buildGscIndex(rows: GscPage[]): Map<string, GscStats> {
  const index = new Map<string, GscStats>();
  for (const row of rows) {
    const key = normaliseUrl(row.url);
    const existing = index.get(key);
    if (existing) {
      existing.clicks += row.clicks;
      existing.impressions += row.impressions;
    } else {
      index.set(key, { clicks: row.clicks, impressions: row.impressions });
    }
  }
  return index;
}

export type PageWithGsc = PageRow & GscStats;

/** Attach measured traffic to each page. Pages absent from GSC get zeroes. */
export function joinGsc(pages: PageRow[], index: Map<string, GscStats>): PageWithGsc[] {
  return pages.map((p) => {
    const stats = index.get(normaliseUrl(p.url)) ?? { clicks: 0, impressions: 0 };
    return { ...p, clicks: stats.clicks, impressions: stats.impressions };
  });
}

const DESTRUCTIVE_ROLES = new Set(["PRUNE", "NOINDEX"]);

/**
 * Pages slated for removal or hiding that measurably earn traffic. Sorted by
 * clicks descending. Rows already flagged for review are omitted — they are
 * on the review list regardless, and re-flagging would double-count them.
 */
export function gscContradictions(
  pages: PageRow[],
  index: Map<string, GscStats>,
  minClicks: number
): PageWithGsc[] {
  return joinGsc(pages, index)
    .filter(
      (p) => DESTRUCTIVE_ROLES.has(p.role) && !p.needsReview && p.clicks >= minClicks
    )
    .sort((a, b) => b.clicks - a.clicks || a.url.localeCompare(b.url));
}

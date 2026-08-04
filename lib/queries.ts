import type { PageRow } from "./types.ts";

/**
 * A destination that is not yet a real URL. The 301 safety rule: never redirect
 * a page before its destination has live content.
 */
export function isBlockedDestination(destinationUrl: string): boolean {
  return destinationUrl.trimStart().startsWith("(NEW)");
}

export function roleCounts(rows: PageRow[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const r of rows) counts[r.role] = (counts[r.role] ?? 0) + 1;
  return counts;
}

export function needsReview(rows: PageRow[]): PageRow[] {
  return rows.filter((r) => r.needsReview);
}

export function actionableMerges(rows: PageRow[]): PageRow[] {
  return rows.filter(
    (r) => r.role === "MERGE+301" && !isBlockedDestination(r.destinationUrl)
  );
}

export function blockedMerges(rows: PageRow[]): { destination: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const r of rows) {
    if (r.role === "MERGE+301" && isBlockedDestination(r.destinationUrl)) {
      counts.set(r.destinationUrl, (counts.get(r.destinationUrl) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([destination, count]) => ({ destination, count }))
    .sort((a, b) => b.count - a.count || a.destination.localeCompare(b.destination));
}

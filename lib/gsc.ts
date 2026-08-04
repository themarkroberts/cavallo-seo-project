import { google } from "googleapis";
import { config } from "../config.ts";
import { getOAuth2Client } from "./google-auth.ts";
import type { GscPage, GscSnapshot, MonthPoint } from "./types.ts";

/** Search Console's per-query row cap. We fail loudly rather than truncate silently. */
const ROW_LIMIT = 25000;

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

/**
 * Measured clicks and impressions from Google Search Console.
 *
 * This is REAL data, unlike the Ahrefs figures which are estimates. Keep the
 * two clearly separated everywhere they are displayed — conflating them is how
 * this project came to believe only ~72 pages had traffic when 1,024 do.
 */
export async function fetchGsc(): Promise<GscSnapshot> {
  const searchconsole = google.searchconsole({ version: "v1", auth: getOAuth2Client() });
  const startDate = isoDaysAgo(365);
  const endDate = isoDaysAgo(1);
  const siteUrl = config.gscSiteUrl;

  const pageRes = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: { startDate, endDate, dimensions: ["page"], rowLimit: ROW_LIMIT },
  });

  const pageRows = pageRes.data.rows ?? [];
  if (pageRows.length === 0) {
    throw new Error(
      `Search Console returned no page rows for ${siteUrl} between ${startDate} and ${endDate}. ` +
        `Confirm the Google account still has access to this property.`
    );
  }
  if (pageRows.length >= ROW_LIMIT) {
    throw new Error(
      `Search Console returned ${pageRows.length} rows, hitting the ${ROW_LIMIT} cap for ${siteUrl}. ` +
        `The result is truncated and would understate traffic. Add pagination before trusting this.`
    );
  }

  const pages: GscPage[] = pageRows.map((r) => ({
    url: r.keys?.[0] ?? "",
    clicks: r.clicks ?? 0,
    impressions: r.impressions ?? 0,
  }));

  const monthRes = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: { startDate, endDate, dimensions: ["date"], rowLimit: ROW_LIMIT },
  });

  const byMonth = new Map<string, number>();
  for (const r of monthRes.data.rows ?? []) {
    const month = (r.keys?.[0] ?? "").slice(0, 7);
    if (month) byMonth.set(month, (byMonth.get(month) ?? 0) + (r.clicks ?? 0));
  }
  const monthly: MonthPoint[] = [...byMonth.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, value]) => ({ month, value }));

  return { fetchedAt: new Date().toISOString(), startDate, endDate, monthly, pages };
}

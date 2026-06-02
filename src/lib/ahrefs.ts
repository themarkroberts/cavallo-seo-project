import type { ClientConfig } from "./clients";
import type { MonthPoint } from "./types";

const API_BASE = "https://api.ahrefs.com/v3";

async function ahrefsFetch(path: string, params: Record<string, string>) {
  const token = process.env.AHREFS_API_TOKEN;
  if (!token) return null;

  const url = new URL(`${API_BASE}${path}`);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    console.error(`Ahrefs API error: ${res.status} ${res.statusText}`);
    return null;
  }

  return res.json();
}

export async function fetchAhrefsVisibility(
  config: ClientConfig
): Promise<MonthPoint[] | null> {
  const data = await ahrefsFetch("/site-explorer/metrics-history", {
    target: config.ahrefs.target,
    mode: config.ahrefs.mode,
    history_grouping: "monthly",
    date_from: "2024-01-01",
    select: "date,org_traffic",
  });

  if (!data?.metrics) return null;

  return data.metrics.map((row: { date: string; org_traffic: number }) => ({
    month: row.date.slice(0, 7),
    value: row.org_traffic,
  }));
}

export async function fetchAhrefsKeywords(
  config: ClientConfig,
  keywords: string[]
): Promise<{ keyword: string; position: number | null; prev: number | null }[] | null> {
  if (!process.env.AHREFS_API_TOKEN) return null;

  const data = await ahrefsFetch("/site-explorer/organic-keywords", {
    target: config.ahrefs.target,
    mode: config.ahrefs.mode,
    select: "keyword,position",
    limit: "1000",
    where: `keyword IN (${keywords.map((k) => `"${k}"`).join(",")})`,
  });

  if (!data?.keywords) return null;

  return data.keywords.map((row: { keyword: string; position: number }) => ({
    keyword: row.keyword,
    position: row.position,
    prev: null,
  }));
}

export async function fetchAhrefsCompetitor(
  config: ClientConfig
): Promise<{ label: string; ourTraffic: number; theirTraffic: number } | null> {
  if (!process.env.AHREFS_API_TOKEN) return null;

  const [ours, theirs] = await Promise.all([
    ahrefsFetch("/site-explorer/metrics", {
      target: config.ahrefs.target,
      mode: config.ahrefs.mode,
    }),
    ahrefsFetch("/site-explorer/metrics", {
      target: config.competitor.target,
      mode: config.competitor.mode,
    }),
  ]);

  if (!ours?.metrics || !theirs?.metrics) return null;

  return {
    label: config.competitor.label,
    ourTraffic: ours.metrics.org_traffic ?? 0,
    theirTraffic: theirs.metrics.org_traffic ?? 0,
  };
}

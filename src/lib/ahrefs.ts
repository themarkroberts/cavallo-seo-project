import type { ClientConfig } from "./clients";
import type { MonthPoint } from "./types";

const API_BASE = "https://api.ahrefs.com/v3";

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

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
    const body = await res.text().catch(() => "");
    console.error(`Ahrefs API error: ${res.status} ${res.statusText} — ${body}`);
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
): Promise<{ keyword: string; position: number | null; prev: number | null; rankingUrl: string | null }[] | null> {
  if (!process.env.AHREFS_API_TOKEN) return null;

  const whereFilter = JSON.stringify({
    or: keywords.map((k) => ({
      field: "keyword",
      is: ["eq", k],
    })),
  });

  const data = await ahrefsFetch("/site-explorer/organic-keywords", {
    target: config.ahrefs.target,
    mode: config.ahrefs.mode,
    select: "keyword,best_position,best_position_url",
    limit: "1000",
    date: todayDate(),
    where: whereFilter,
  });

  if (!data?.keywords) return null;

  return data.keywords.map((row: { keyword: string; best_position: number | null; best_position_url: string | null }) => ({
    keyword: row.keyword,
    position: row.best_position ?? null,
    prev: null,
    rankingUrl: row.best_position_url ?? null,
  }));
}

export async function fetchAhrefsCompetitors(
  config: ClientConfig
): Promise<{ label: string; traffic: number }[] | null> {
  if (!process.env.AHREFS_API_TOKEN) return null;

  const fetches = [
    { label: config.name, target: config.ahrefs.target, mode: config.ahrefs.mode },
    ...config.competitors.map((c) => ({ label: c.label, target: c.target, mode: c.mode })),
  ];

  const results = await Promise.all(
    fetches.map(async (f) => {
      const data = await ahrefsFetch("/site-explorer/metrics", {
        target: f.target,
        mode: f.mode,
        date: todayDate(),
      });
      return {
        label: f.label,
        traffic: data?.metrics?.org_traffic ?? 0,
      };
    })
  );

  return results.some((r) => r.traffic > 0) ? results : null;
}

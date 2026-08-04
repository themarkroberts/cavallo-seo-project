import { config } from "../config.ts";
import { requireEnv } from "./env.ts";
import type { MonthPoint } from "./types.ts";

const API_BASE = "https://api.ahrefs.com/v3";

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

async function ahrefsFetch(path: string, params: Record<string, string>) {
  const token = requireEnv("AHREFS_API_TOKEN");
  const url = new URL(`${API_BASE}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Ahrefs ${path} failed: ${res.status} ${res.statusText} — ${body}`);
  }
  return res.json();
}

export async function fetchAhrefsVisibility(): Promise<MonthPoint[]> {
  const data = await ahrefsFetch("/site-explorer/metrics-history", {
    target: config.ahrefs.target,
    mode: config.ahrefs.mode,
    history_grouping: "monthly",
    date_from: "2024-01-01",
    select: "date,org_traffic",
  });

  if (!data?.metrics) {
    throw new Error("Ahrefs metrics-history returned no metrics array");
  }

  return data.metrics.map((row: { date: string; org_traffic: number }) => ({
    month: row.date.slice(0, 7),
    value: row.org_traffic,
  }));
}

export async function fetchAhrefsCompetitors(): Promise<{ label: string; traffic: number }[]> {
  const targets = [
    { label: config.name, target: config.ahrefs.target, mode: config.ahrefs.mode },
    ...config.competitors,
  ];

  return Promise.all(
    targets.map(async (t) => {
      const data = await ahrefsFetch("/site-explorer/metrics", {
        target: t.target,
        mode: t.mode,
        date: todayDate(),
      });
      return { label: t.label, traffic: data?.metrics?.org_traffic ?? 0 };
    })
  );
}

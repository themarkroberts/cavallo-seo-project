import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/clients";
import { getSnapshotFromKV, writeSnapshotToKV } from "@/lib/kv";
import { fetchNotionTasks } from "@/lib/notion";
import { fetchGA4Data } from "@/lib/ga4";
import { fetchAhrefsVisibility, fetchAhrefsKeywords, fetchAhrefsCompetitors } from "@/lib/ahrefs";
import { syncSnapshotToNotion } from "@/lib/notion-sync";
import { seedSnapshot } from "../../../../../data/cavallo-history";
import type { ClientSnapshot } from "@/lib/types";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (!process.env.CRON_SECRET || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientSlug = request.nextUrl.searchParams.get("client") ?? "cavallo";
  const config = getClient(clientSlug);

  if (!config) {
    return NextResponse.json({ error: "Unknown client" }, { status: 404 });
  }

  const existing = await getSnapshotFromKV(clientSlug);
  const base = existing ?? (seedSnapshot as ClientSnapshot);

  const [notionTasks, ga4, visibility, competitors] = await Promise.all([
    fetchNotionTasks(config),
    fetchGA4Data(config),
    fetchAhrefsVisibility(config),
    fetchAhrefsCompetitors(config),
  ]);

  const currentKeywords = base.targetKeywords.map((k) => k.keyword);
  const keywords = await fetchAhrefsKeywords(config, currentKeywords);

  const mergedKeywords = keywords
    ? base.targetKeywords.map((existing) => {
        const fresh = keywords.find((k) => k.keyword === existing.keyword);
        return fresh
          ? { ...existing, prev: existing.position, position: fresh.position }
          : existing;
      })
    : base.targetKeywords;

  const updatedPhases = notionTasks.length > 0
    ? base.phases.map((phase) => ({
        ...phase,
        tasks: phase.tasks.map((task) => {
          const match = notionTasks.find((nt) => nt.name === task.name);
          return match ? { ...task, status: match.status, due: match.due ?? task.due } : task;
        }),
      }))
    : base.phases;

  const snapshot: ClientSnapshot = {
    ...base,
    lastUpdated: new Date().toISOString(),
    phases: updatedPhases,
    sessions: ga4?.sessions ?? base.sessions,
    revenue: ga4?.revenue ?? base.revenue,
    visibility: visibility ?? base.visibility,
    targetKeywords: mergedKeywords,
    competitors: competitors ?? base.competitors,
  };

  await writeSnapshotToKV(clientSlug, snapshot);

  const notionSync = await syncSnapshotToNotion(config, snapshot);

  return NextResponse.json({
    ok: true,
    client: clientSlug,
    lastUpdated: snapshot.lastUpdated,
    sources: {
      notion: notionTasks.length > 0,
      ga4: ga4 !== null,
      ahrefs: visibility !== null,
      keywords: keywords !== null,
      competitors: competitors !== null,
    },
    notionSync,
  });
}

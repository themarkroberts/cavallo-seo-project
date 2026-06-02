import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/clients";
import { getSnapshotFromKV, writeSnapshotToKV } from "@/lib/kv";
import { fetchNotionTasks } from "@/lib/notion";
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

  const tasks = await fetchNotionTasks(config);

  // TODO: Phase 3 — fetch GA4 sessions + revenue
  // TODO: Phase 4 — fetch Ahrefs visibility + keywords + competitor
  // TODO: Phase 5 — fetch GSC pillar-page data

  const snapshot: ClientSnapshot = {
    ...base,
    lastUpdated: new Date().toISOString(),
    tasks: tasks.length > 0 ? tasks : base.tasks,
  };

  await writeSnapshotToKV(clientSlug, snapshot);

  return NextResponse.json({
    ok: true,
    client: clientSlug,
    tasksUpdated: tasks.length,
    lastUpdated: snapshot.lastUpdated,
  });
}

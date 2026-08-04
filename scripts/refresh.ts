#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { fetchAhrefsVisibility, fetchAhrefsCompetitors } from "../lib/ahrefs.ts";
import { fetchGA4Data } from "../lib/ga4.ts";
import { fetchTasks } from "../lib/notion-tasks.ts";
import type { Metrics } from "../lib/types.ts";

try {
  const [visibility, competitors, ga4, tasks] = await Promise.all([
    fetchAhrefsVisibility(),
    fetchAhrefsCompetitors(),
    fetchGA4Data(),
    fetchTasks(),
  ]);

  const metrics: Metrics = {
    fetchedAt: new Date().toISOString(),
    visibility,
    sessions: ga4.sessions,
    revenue: ga4.revenue,
    competitors,
  };

  writeFileSync("state/metrics.json", JSON.stringify(metrics, null, 2) + "\n", "utf8");
  writeFileSync("state/tasks.json", JSON.stringify(tasks, null, 2) + "\n", "utf8");

  console.log(
    `Refreshed. ${visibility.length} months of Ahrefs traffic, ` +
      `${ga4.sessions.length} months of GA4, ${tasks.tasks.length} Notion tasks. ` +
      `Now run: npm run build`
  );
} catch (err) {
  console.error(`Refresh failed: ${err instanceof Error ? err.message : String(err)}`);
  console.error("Nothing was written. Existing state/*.json files are unchanged.");
  process.exit(1);
}

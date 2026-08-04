#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { fetchAhrefsVisibility, fetchAhrefsCompetitors } from "../lib/ahrefs.ts";
import { fetchGA4Data } from "../lib/ga4.ts";
import { fetchGsc } from "../lib/gsc.ts";
import { fetchTasks } from "../lib/notion-tasks.ts";
import type { Metrics } from "../lib/types.ts";

try {
  const [visibility, competitors, ga4, gsc] = await Promise.all([
    fetchAhrefsVisibility(),
    fetchAhrefsCompetitors(),
    fetchGA4Data(),
    fetchGsc(),
  ]);

  const metrics: Metrics = {
    fetchedAt: new Date().toISOString(),
    visibility,
    sessions: ga4.sessions,
    revenue: ga4.revenue,
    competitors,
  };

  writeFileSync("state/metrics.json", JSON.stringify(metrics, null, 2) + "\n", "utf8");
  writeFileSync("state/gsc.json", JSON.stringify(gsc, null, 2) + "\n", "utf8");

  const totalClicks = gsc.pages.reduce((n, p) => n + p.clicks, 0);
  console.log(
    `Refreshed.\n` +
      `  Ahrefs:  ${visibility.length} months of ESTIMATED traffic, ${competitors.length} competitors\n` +
      `  GA4:     ${ga4.sessions.length} months of sessions and revenue\n` +
      `  GSC:     ${gsc.pages.length} pages, ${totalClicks.toLocaleString()} MEASURED clicks ` +
      `(${gsc.startDate} to ${gsc.endDate})`
  );

  // Notion tasks are optional: an internal integration token requires admin
  // rights in the workspace owning the task database. Absence is REPORTED, not
  // hidden — but a token that is present and fails still throws.
  if (process.env.NOTION_TOKEN) {
    const tasks = await fetchTasks();
    writeFileSync("state/tasks.json", JSON.stringify(tasks, null, 2) + "\n", "utf8");
    console.log(`  Notion:  ${tasks.tasks.length} tasks`);
  } else {
    console.log(
      `  Notion:  SKIPPED — NOTION_TOKEN is not set, so state/tasks.json was not updated.\n` +
        `           This is expected if you cannot create an integration in that workspace.`
    );
  }

  console.log(`\nNow run: npm run build`);
} catch (err) {
  console.error(`Refresh failed: ${err instanceof Error ? err.message : String(err)}`);
  console.error("Nothing was written. Existing state/*.json files are unchanged.");
  process.exit(1);
}

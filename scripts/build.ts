#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { readState } from "../lib/state.ts";
import { renderDashboard } from "../lib/render.ts";

const OUT = "dashboard.html";

try {
  const state = readState();
  writeFileSync(OUT, renderDashboard(state), "utf8");
  console.log(
    `Wrote ${OUT} — ${state.pages.length} pages, ` +
      `${state.learn.length} explainer${state.learn.length === 1 ? "" : "s"}, ` +
      `metrics ${state.metrics ? `from ${state.metrics.fetchedAt}` : "NOT YET FETCHED"}.`
  );
} catch (err) {
  console.error(`Build failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
}

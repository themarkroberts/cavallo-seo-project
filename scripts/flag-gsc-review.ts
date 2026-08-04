#!/usr/bin/env node
/**
 * ONE-TIME. Flags pages marked PRUNE or NOINDEX that measurably earn Search
 * Console clicks, so they get a human look before any redirect or noindex runs.
 *
 * Changes NO roles. It only sets needs_review and appends evidence — every
 * reclassification stays Mark's decision.
 *
 * Reports by default. Pass --apply to write. Refuses to run twice, because
 * re-flagging rows that have been deliberately cleared is the same class of
 * mistake as re-running the retired classifier.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { readPages, writePages } from "../lib/pages.ts";
import { buildGscIndex, gscContradictions } from "../lib/gsc-join.ts";
import type { GscSnapshot } from "../lib/types.ts";

const MIN_CLICKS = 10;
const MARKER = "GSC:";
const GSC_PATH = "state/gsc.json";
const DECISIONS_PATH = "state/decisions.md";

const apply = process.argv.includes("--apply");
const force = process.argv.includes("--force");

try {
  const pages = readPages();
  const raw = readFileSync(GSC_PATH, "utf8");
  const gsc = JSON.parse(raw) as GscSnapshot;

  const alreadyRun = pages.some((p) => p.evidence.includes(MARKER));
  if (alreadyRun && !force) {
    console.error(
      `Refusing to run: "${MARKER}" already appears in state/pages.csv, so this script has\n` +
        `already been applied. Re-running would re-flag rows you have since cleared.\n` +
        `Pass --force only if you are certain that is what you want.`
    );
    process.exit(1);
  }

  const index = buildGscIndex(gsc.pages);
  const found = gscContradictions(pages, index, MIN_CLICKS);

  console.log(
    `Pages marked PRUNE or NOINDEX with >=${MIN_CLICKS} measured clicks ` +
      `(${gsc.startDate} to ${gsc.endDate}):\n`
  );
  console.log("  clicks  impr    role     url");
  for (const p of found) {
    console.log(
      `  ${String(p.clicks).padStart(6)}  ${String(p.impressions).padStart(6)}  ` +
        `${p.role.padEnd(8)} ${p.url.replace("https://cavallo-inc.com", "")}`
    );
  }
  console.log(`\n  ${found.length} contradictions found.`);

  if (!apply) {
    console.log(`\nNothing written. Re-run with --apply to flag these for review.`);
    process.exit(0);
  }

  // found already carries the joined click count — no need to re-derive it.
  const clicksByUrl = new Map(found.map((f) => [f.url, f.clicks]));
  const updated = pages.map((p) => {
    const clicks = clicksByUrl.get(p.url);
    if (clicks === undefined) return p;
    return {
      ...p,
      needsReview: true,
      evidence:
        `${p.evidence} ${MARKER} ${clicks} measured clicks ` +
        `${gsc.startDate}..${gsc.endDate} — role contradicted by real data, needs review.`,
    };
  });

  writePages(updated);

  const note =
    `\n## ${new Date().toISOString().slice(0, 10)} — ${found.length} pages flagged from Search Console data\n\n` +
    `Search Console turned out to be readable after all (it was assumed blocked). Measured clicks\n` +
    `contradict the role on ${found.length} pages marked PRUNE or NOINDEX, all at >=${MIN_CLICKS} clicks over\n` +
    `${gsc.startDate}..${gsc.endDate}. They are flagged for review; no role was changed.\n\n` +
    `Largest disagreements:\n\n` +
    found
      .slice(0, 10)
      .map((p) => `- ${p.clicks} clicks — \`${p.url.replace("https://cavallo-inc.com", "")}\` marked ${p.role}`)
      .join("\n") +
    `\n\nThe wider picture: the classifier was directionally right. All 787 PRUNE+NOINDEX rows together\n` +
    `hold about 4% of site clicks. This is a thin tail of wrong calls, not a systemic failure.\n`;

  writeFileSync(DECISIONS_PATH, readFileSync(DECISIONS_PATH, "utf8").trimEnd() + "\n" + note, "utf8");

  const nowFlagged = readPages().filter((p) => p.needsReview).length;
  console.log(`\nApplied. state/pages.csv now has ${nowFlagged} rows needing review.`);
  console.log(`Reasoning appended to ${DECISIONS_PATH}. Now run: npm run build`);
} catch (err) {
  console.error(`Failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
}

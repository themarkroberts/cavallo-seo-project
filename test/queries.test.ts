import { test } from "node:test";
import assert from "node:assert";
import {
  isBlockedDestination,
  roleCounts,
  needsReview,
  actionableMerges,
  blockedMerges,
} from "../lib/queries.ts";
import type { PageRow } from "../lib/types.ts";

function row(over: Partial<PageRow> = {}): PageRow {
  return {
    url: "https://x.com/a/",
    pillar: "None",
    role: "PRUNE",
    destinationUrl: "",
    evidence: "",
    source: "Auto",
    needsReview: false,
    ...over,
  };
}

test("a (NEW) destination is blocked", () => {
  assert.equal(isBlockedDestination("(NEW) Pillar 2 — Hoof Abscess spoke"), true);
});

test("a live URL destination is not blocked", () => {
  assert.equal(isBlockedDestination("https://cavallo-inc.com/x/"), false);
});

test("an empty destination is not blocked", () => {
  assert.equal(isBlockedDestination(""), false);
});

test("counts roles", () => {
  const rows = [row({ role: "PRUNE" }), row({ role: "PRUNE" }), row({ role: "NOINDEX" })];
  assert.deepEqual(roleCounts(rows), { PRUNE: 2, NOINDEX: 1 });
});

test("selects only rows flagged for review", () => {
  const rows = [row({ needsReview: true }), row()];
  assert.equal(needsReview(rows).length, 1);
});

test("actionable merges exclude unbuilt destinations", () => {
  const rows = [
    row({ role: "MERGE+301", destinationUrl: "https://cavallo-inc.com/live/" }),
    row({ role: "MERGE+301", destinationUrl: "(NEW) Pillar 2 — Hoof Abscess spoke" }),
    row({ role: "PRUNE", destinationUrl: "https://cavallo-inc.com/live/" }),
  ];
  const result = actionableMerges(rows);
  assert.equal(result.length, 1);
  assert.equal(result[0].destinationUrl, "https://cavallo-inc.com/live/");
});

test("blocked merges group by destination, most-blocked first", () => {
  const rows = [
    row({ role: "MERGE+301", destinationUrl: "(NEW) A" }),
    row({ role: "MERGE+301", destinationUrl: "(NEW) B" }),
    row({ role: "MERGE+301", destinationUrl: "(NEW) B" }),
    row({ role: "MERGE+301", destinationUrl: "https://cavallo-inc.com/live/" }),
  ];
  assert.deepEqual(blockedMerges(rows), [
    { destination: "(NEW) B", count: 2 },
    { destination: "(NEW) A", count: 1 },
  ]);
});

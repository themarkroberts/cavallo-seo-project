import { test } from "node:test";
import assert from "node:assert";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readState, readLearnDocs } from "../lib/state.ts";

function fixture(): string {
  const root = mkdtempSync(join(tmpdir(), "cavallo-"));
  mkdirSync(join(root, "state"));
  mkdirSync(join(root, "learn"));
  writeFileSync(join(root, "state", "where-we-are.md"), "# Where we are\nStep 3 of 5.");
  writeFileSync(join(root, "state", "decisions.md"), "# Decisions");
  writeFileSync(join(root, "state", "next-actions.md"), "# Next");
  writeFileSync(
    join(root, "state", "phases.json"),
    JSON.stringify({
      source: "reference/01-roadmap.md",
      updated: "2026-08-05",
      phases: [
        {
          number: 1,
          month: "June 2026",
          title: "Foundation",
          active: true,
          outcome: "Site out of holding pattern.",
          teamRole: [],
          deliverables: [
            {
              id: "1.1",
              title: "Pillar 1 live",
              promised: "Commercial hub.",
              owner: "Mark",
              status: "built",
              evidence: "Renders on preview.",
            },
          ],
        },
      ],
    })
  );
  writeFileSync(
    join(root, "state", "pages.csv"),
    "url,pillar,role,destination_url,evidence,source,needs_review\n" +
      "https://x.com/a/,None,PRUNE,,e,Auto,No\n"
  );
  return root;
}

test("reads markdown and pages", () => {
  const state = readState(fixture());
  assert.match(state.whereWeAre, /Step 3 of 5/);
  assert.equal(state.pages.length, 1);
});

test("reads the phase deliverables", () => {
  const state = readState(fixture());
  assert.equal(state.phases.phases.length, 1);
  assert.equal(state.phases.phases[0].deliverables[0].status, "built");
  // Optional fields default rather than coming back undefined.
  assert.deepEqual(state.phases.phases[0].deliverables[0].defects, []);
  assert.equal(state.phases.phases[0].note, "");
});

test("metrics and tasks are null when their files are absent", () => {
  const state = readState(fixture());
  assert.equal(state.metrics, null);
  assert.equal(state.tasks, null);
});

test("reads metrics when present", () => {
  const root = fixture();
  writeFileSync(
    join(root, "state", "metrics.json"),
    JSON.stringify({
      fetchedAt: "2026-08-04T00:00:00Z",
      visibility: [{ month: "2026-07", value: 10 }],
      sessions: [],
      revenue: [],
      competitors: [],
    })
  );
  const state = readState(root);
  assert.equal(state.metrics?.visibility[0].value, 10);
});

test("learn docs take their title from the first heading", () => {
  const root = fixture();
  writeFileSync(join(root, "learn", "why-301.md"), "# Why 301 beats noindex\n\nBody text.");
  const docs = readLearnDocs(join(root, "learn"));
  assert.equal(docs[0].slug, "why-301");
  assert.equal(docs[0].title, "Why 301 beats noindex");
  assert.match(docs[0].body, /Body text/);
});

test("learn doc without a heading falls back to its slug", () => {
  const root = fixture();
  writeFileSync(join(root, "learn", "untitled.md"), "Just body.");
  const docs = readLearnDocs(join(root, "learn"));
  assert.equal(docs[0].title, "untitled");
});

test("a missing state file fails loudly", () => {
  const root = mkdtempSync(join(tmpdir(), "cavallo-empty-"));
  assert.throws(() => readState(root), /Missing required state file/);
});

test("a missing phases.json fails loudly rather than yielding an empty roadmap", () => {
  const root = mkdtempSync(join(tmpdir(), "cavallo-nophases-"));
  mkdirSync(join(root, "state"));
  assert.throws(() => readState(root), /phases\.json/);
});

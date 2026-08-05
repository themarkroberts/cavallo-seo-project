import { test } from "node:test";
import assert from "node:assert";
import { parsePhases, readPhases, statusCounts } from "../lib/phases.ts";

function file(over: Record<string, unknown> = {}): string {
  return JSON.stringify({
    source: "reference/01-roadmap.md",
    updated: "2026-08-05",
    phases: [
      {
        number: 1,
        month: "June 2026",
        title: "Foundation",
        active: true,
        outcome: "Site out of holding pattern.",
        teamRole: ["Review pillar copy"],
        deliverables: [
          {
            id: "1.1",
            title: "Pillar 1 live",
            promised: "Commercial hub.",
            owner: "Mark",
            status: "built",
            evidence: "Renders on preview, absent from production.",
          },
        ],
      },
    ],
    ...over,
  });
}

/** Replace the single deliverable, keeping everything else valid. */
function withDeliverable(d: Record<string, unknown>): string {
  const parsed = JSON.parse(file()) as {
    phases: { deliverables: Record<string, unknown>[] }[];
  };
  parsed.phases[0].deliverables = [d];
  return JSON.stringify(parsed);
}

test("parses a valid file", () => {
  const f = parsePhases(file());
  assert.equal(f.phases.length, 1);
  assert.equal(f.phases[0].deliverables[0].id, "1.1");
  assert.equal(f.phases[0].deliverables[0].status, "built");
});

test("an unknown status fails loudly and names the allowed values", () => {
  const bad = withDeliverable({
    id: "1.1",
    title: "t",
    promised: "p",
    owner: "Mark",
    status: "nearly-done",
    evidence: "e",
  });
  assert.throws(() => parsePhases(bad), /unknown status "nearly-done".*not-started/s);
});

test("blocked without blockedBy fails loudly", () => {
  const bad = withDeliverable({
    id: "1.1",
    title: "t",
    promised: "p",
    owner: "Carole",
    status: "blocked",
    evidence: "e",
  });
  assert.throws(() => parsePhases(bad), /say what blocks it/);
});

test("blockedBy on a non-blocked deliverable fails loudly", () => {
  const bad = withDeliverable({
    id: "1.1",
    title: "t",
    promised: "p",
    owner: "Mark",
    status: "done",
    evidence: "e",
    blockedBy: "something",
  });
  assert.throws(() => parsePhases(bad), /"blockedBy" is set but status is "done"/);
});

test("a missing evidence line fails loudly — a status with no justification is the bug", () => {
  const bad = withDeliverable({
    id: "1.1",
    title: "t",
    promised: "p",
    owner: "Mark",
    status: "done",
    evidence: "   ",
  });
  assert.throws(() => parsePhases(bad), /missing or empty "evidence"/);
});

test("duplicate deliverable ids fail loudly", () => {
  const parsed = JSON.parse(file()) as {
    phases: { deliverables: Record<string, unknown>[] }[];
  };
  parsed.phases[0].deliverables.push({ ...parsed.phases[0].deliverables[0] });
  assert.throws(() => parsePhases(JSON.stringify(parsed)), /duplicate deliverable id "1\.1"/);
});

test("duplicate phase numbers fail loudly", () => {
  const parsed = JSON.parse(file()) as { phases: unknown[] };
  parsed.phases.push(JSON.parse(JSON.stringify(parsed.phases[0])));
  assert.throws(() => parsePhases(JSON.stringify(parsed)), /duplicate phase number 1/);
});

test("a missing source fails loudly — provenance is not optional", () => {
  const parsed = JSON.parse(file()) as Record<string, unknown>;
  delete parsed.source;
  assert.throws(() => parsePhases(JSON.stringify(parsed)), /missing "source"/);
});

test("malformed JSON names the file", () => {
  assert.throws(() => parsePhases("{ nope"), /state\/phases\.json/);
});

test("phases come back sorted by number", () => {
  const parsed = JSON.parse(file()) as { phases: Record<string, unknown>[] };
  const two = { ...JSON.parse(JSON.stringify(parsed.phases[0])), number: 2 } as Record<
    string,
    unknown
  >;
  (two.deliverables as Record<string, unknown>[])[0].id = "2.1";
  parsed.phases = [two, parsed.phases[0]];
  const f = parsePhases(JSON.stringify(parsed));
  assert.deepEqual(
    f.phases.map((p) => p.number),
    [1, 2]
  );
});

test("statusCounts counts every status, including zeroes", () => {
  const f = parsePhases(file());
  const counts = statusCounts(f.phases[0].deliverables);
  assert.equal(counts.built, 1);
  assert.equal(counts.done, 0);
  assert.equal(counts.blocked, 0);
});

test("the real state/phases.json is valid", () => {
  const f = readPhases("state/phases.json");
  assert.deepEqual(
    f.phases.map((p) => p.number),
    [1, 2, 3, 4, 5, 6]
  );
  // Every deliverable carries evidence — the whole point of the file.
  for (const p of f.phases) {
    for (const d of p.deliverables) {
      assert.ok(d.evidence.length > 0, `${d.id} has no evidence`);
    }
  }
});

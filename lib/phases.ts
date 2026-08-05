import { existsSync, readFileSync } from "node:fs";
import type {
  Deliverable,
  DeliverableLink,
  DeliverableStatus,
  Phase,
  PhasesFile,
} from "./types.ts";

const STATUSES: DeliverableStatus[] = [
  "done",
  "built",
  "in-progress",
  "blocked",
  "not-started",
];

/** Human labels. `built` is the state this project kept losing: finished, but not on production. */
export const STATUS_LABEL: Record<DeliverableStatus, string> = {
  done: "Done",
  built: "Built, not live",
  "in-progress": "In progress",
  blocked: "Blocked",
  "not-started": "Not started",
};

const DEFAULT_PATH = "state/phases.json";

function fail(where: string, msg: string): never {
  throw new Error(`state/phases.json — ${where}: ${msg}`);
}

function parseDeliverable(raw: unknown, where: string): Deliverable {
  if (typeof raw !== "object" || raw === null) fail(where, "deliverable is not an object");
  const d = raw as Record<string, unknown>;

  for (const key of ["id", "title", "promised", "owner", "status", "evidence"]) {
    if (typeof d[key] !== "string" || (d[key] as string).trim() === "") {
      fail(where, `missing or empty "${key}"`);
    }
  }

  const status = d.status as DeliverableStatus;
  if (!STATUSES.includes(status)) {
    fail(where, `unknown status "${String(d.status)}". Expected one of: ${STATUSES.join(", ")}`);
  }

  // A blocked deliverable that does not say what blocks it is the silent-failure pattern
  // this project exists to avoid.
  if (status === "blocked" && (typeof d.blockedBy !== "string" || d.blockedBy.trim() === "")) {
    fail(where, `status is "blocked" but "blockedBy" is missing — say what blocks it`);
  }
  if (status !== "blocked" && d.blockedBy !== undefined) {
    fail(where, `"blockedBy" is set but status is "${status}", not "blocked"`);
  }

  const links: DeliverableLink[] = [];
  if (d.links !== undefined) {
    if (!Array.isArray(d.links)) fail(where, `"links" must be an array`);
    for (const [i, raw] of (d.links as unknown[]).entries()) {
      if (typeof raw !== "object" || raw === null) fail(where, `links[${i}] is not an object`);
      const l = raw as Record<string, unknown>;
      for (const key of ["label", "url", "note"]) {
        if (typeof l[key] !== "string" || (l[key] as string).trim() === "") {
          fail(where, `links[${i}] missing or empty "${key}"`);
        }
      }
      // Only absolute http(s) URLs — a bare path would be resolved against the local
      // dashboard file and silently 404 in the browser.
      if (!/^https?:\/\//.test(l.url as string)) {
        fail(where, `links[${i}] url must be absolute http(s), got "${String(l.url)}"`);
      }
      links.push({ label: l.label as string, url: l.url as string, note: l.note as string });
    }
  }

  if (d.defects !== undefined) {
    if (!Array.isArray(d.defects) || d.defects.some((x) => typeof x !== "string")) {
      fail(where, `"defects" must be an array of strings`);
    }
  }

  return {
    id: d.id as string,
    title: d.title as string,
    promised: d.promised as string,
    owner: d.owner as string,
    status,
    evidence: d.evidence as string,
    blockedBy: d.blockedBy as string | undefined,
    defects: (d.defects as string[]) ?? [],
    links,
  };
}

function parsePhase(raw: unknown, index: number): Phase {
  if (typeof raw !== "object" || raw === null) fail(`phase[${index}]`, "not an object");
  const p = raw as Record<string, unknown>;
  const where = `phase ${String(p.number ?? index)}`;

  if (typeof p.number !== "number") fail(where, `"number" must be a number`);
  for (const key of ["month", "title", "outcome"]) {
    if (typeof p[key] !== "string" || (p[key] as string).trim() === "") {
      fail(where, `missing or empty "${key}"`);
    }
  }
  if (typeof p.active !== "boolean") fail(where, `"active" must be a boolean`);
  if (!Array.isArray(p.deliverables) || p.deliverables.length === 0) {
    fail(where, `"deliverables" must be a non-empty array`);
  }
  if (!Array.isArray(p.teamRole) || p.teamRole.some((x) => typeof x !== "string")) {
    fail(where, `"teamRole" must be an array of strings`);
  }

  return {
    number: p.number,
    month: p.month as string,
    title: p.title as string,
    active: p.active,
    outcome: p.outcome as string,
    note: typeof p.note === "string" ? p.note : "",
    teamRole: p.teamRole as string[],
    deliverables: p.deliverables.map((d, i) =>
      parseDeliverable(d, `${where}, deliverable[${i}]`)
    ),
  };
}

export function parsePhases(text: string): PhasesFile {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (err) {
    fail("file", `is not valid JSON — ${(err as Error).message}`);
  }
  if (typeof raw !== "object" || raw === null) fail("file", "top level is not an object");
  const f = raw as Record<string, unknown>;

  if (typeof f.source !== "string") fail("file", `missing "source" — record where the commitments came from`);
  if (typeof f.updated !== "string") fail("file", `missing "updated"`);
  if (!Array.isArray(f.phases)) fail("file", `missing "phases" array`);

  const phases = f.phases.map(parsePhase);

  const seen = new Set<number>();
  for (const p of phases) {
    if (seen.has(p.number)) fail("file", `duplicate phase number ${p.number}`);
    seen.add(p.number);
  }

  const ids = new Set<string>();
  for (const p of phases) {
    for (const d of p.deliverables) {
      if (ids.has(d.id)) fail("file", `duplicate deliverable id "${d.id}"`);
      ids.add(d.id);
    }
  }

  return {
    source: f.source,
    updated: f.updated,
    phases: phases.sort((a, b) => a.number - b.number),
  };
}

export function readPhases(path: string = DEFAULT_PATH): PhasesFile {
  // Same fail-loudly contract as the rest of state/: never silently yield an empty roadmap.
  if (!existsSync(path)) {
    throw new Error(`Missing required state file: ${path}`);
  }
  return parsePhases(readFileSync(path, "utf8"));
}

/** Count deliverables by status, for the per-phase summary line. */
export function statusCounts(deliverables: Deliverable[]): Record<DeliverableStatus, number> {
  const counts = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<
    DeliverableStatus,
    number
  >;
  for (const d of deliverables) counts[d.status] += 1;
  return counts;
}

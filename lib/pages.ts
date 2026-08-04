import { readFileSync, writeFileSync } from "node:fs";
import { parseCsv, serializeCsv } from "./csv.ts";
import type { PageRow, Role } from "./types.ts";

export const PAGES_HEADER = [
  "url",
  "pillar",
  "role",
  "destination_url",
  "evidence",
  "source",
  "needs_review",
];

const ROLES: Role[] = [
  "KEEP-CANONICAL",
  "OPTIMIZE",
  "KEEP-SPOKE",
  "MERGE+301",
  "REWRITE",
  "NOINDEX",
  "PRUNE",
];

const DEFAULT_PATH = "state/pages.csv";

export function parsePages(text: string): PageRow[] {
  const rows = parseCsv(text.trim());
  const [header, ...body] = rows;

  if (!header || header.join(",") !== PAGES_HEADER.join(",")) {
    throw new Error(
      `Unexpected header in pages CSV.\n  expected: ${PAGES_HEADER.join(",")}\n  got:      ${header?.join(",")}`
    );
  }

  return body.map((cells, i) => {
    const role = cells[2] as Role;
    if (!ROLES.includes(role)) {
      throw new Error(`Unknown role "${cells[2]}" on row ${i + 2} (${cells[0]})`);
    }
    const source = cells[5];
    if (source !== "Seed" && source !== "Auto") {
      throw new Error(`Unknown source "${source}" on row ${i + 2} (${cells[0]})`);
    }
    return {
      url: cells[0],
      pillar: cells[1],
      role,
      destinationUrl: cells[3],
      evidence: cells[4],
      source,
      needsReview: cells[6] === "Yes",
    };
  });
}

export function serializePages(rows: PageRow[]): string {
  return serializeCsv([
    PAGES_HEADER,
    ...rows.map((r) => [
      r.url,
      r.pillar,
      r.role,
      r.destinationUrl,
      r.evidence,
      r.source,
      r.needsReview ? "Yes" : "No",
    ]),
  ]);
}

export function readPages(path: string = DEFAULT_PATH): PageRow[] {
  return parsePages(readFileSync(path, "utf8"));
}

export function writePages(rows: PageRow[], path: string = DEFAULT_PATH): void {
  writeFileSync(path, serializePages(rows) + "\n", "utf8");
}

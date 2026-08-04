# Project Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the abandoned Next.js/Notion reporting stack with a file-based project dashboard that tells Mark where the Cavallo SEO project stands, what to do next, and why.

**Architecture:** Project state lives in version-controlled markdown, CSV, and JSON under `state/` and `learn/`. Two Node scripts operate on it: `refresh.ts` pulls fresh numbers from Ahrefs, GA4, and the Notion task database; `build.ts` renders everything into a single self-contained `dashboard.html` opened from disk. No server, no hosting, no scheduled jobs, no write-back to Notion.

**Tech Stack:** Node 22 (TypeScript executed directly, no bundler), `node:test` + `node:assert`, `@notionhq/client` (read-only), `googleapis`. Zero new dependencies.

## Global Constraints

- Node 22+ runs `.ts` files directly. No bundler, transpiler, or build step. Relative imports MUST include the `.ts` extension.
- `package.json` MUST have `"type": "module"`.
- Zero new dependencies. Only `@notionhq/client` and `googleapis` (both already installed) are permitted.
- Tests run with `node --test "test/**/*.test.ts"`. No jest, vitest, or ts-node.
- Secrets load via `node --env-file=.env.local`. Never hardcode a credential.
- **Fail loudly.** No function may swallow an error and return stale, empty, or null data in its place. Missing credentials and failed fetches MUST throw with a message naming the missing variable and how to fix it. This is a direct correction of the retired app, which had 23 silent-failure paths and would render June data labeled as current.
- Every traffic or visibility figure displayed MUST be labeled as an Ahrefs estimate, not measured clicks. GSC is permission-blocked for cavallo-inc.com and only ~72 of 1,154 pages register any organic traffic.
- **Nothing writes to Notion.** Notion access is read-only, limited to data source `ff3ec7b0-97d8-42a0-b323-5eb8badc3a1e`.
- `dashboard.html` is gitignored. `state/*.json` and `state/*.csv` are committed — their diffs are the progress record.
- Work on branch `design/project-dashboard`. Commit after every task.

## Deviation from the spec's phase order

The spec ordered app deletion last (Phase 3). This plan does it **first**, for three reasons:

1. The new scripts require `"type": "module"` in `package.json`, which conflicts with the Next.js app's CommonJS assumptions. Running both states at once creates confusing breakage.
2. The app is already non-functional — no `.env.local` exists and its storage layer (`@vercel/kv`) is a discontinued product.
3. Deletion is **not** blocked by the Notion extraction. Extraction happens over MCP, not through app code, so nothing in `src/` is needed for it.

Git preserves everything deleted.

## File Structure

| File | Responsibility |
|---|---|
| `config.ts` | The single Cavallo config object. Replaces the multi-client `clients.ts` registry. |
| `lib/types.ts` | Shared types: `PageRow`, `Role`, `MonthPoint`, `Metrics`, `Task`, `ProjectState`. |
| `lib/env.ts` | `requireEnv()` — the loud-failure gate for credentials. |
| `lib/csv.ts` | RFC4180 parse/serialize. Isolated because quoted fields containing commas are the main correctness risk. |
| `lib/pages.ts` | Read/write `state/pages.csv` as `PageRow[]`. |
| `lib/queries.ts` | Derived facts: role counts, rows needing review, blocked vs actionable merges. |
| `lib/state.ts` | Assemble `ProjectState` from `state/` and `learn/`. |
| `lib/render.ts` | `ProjectState` → HTML string. |
| `lib/ahrefs.ts` | Moved from `src/lib`. Config param narrowed, silent returns replaced with throws. |
| `lib/ga4.ts` | Moved from `src/lib`. Same treatment. |
| `lib/google-auth.ts` | Moved from `src/lib`. Same treatment. |
| `lib/notion-tasks.ts` | Read-only task fetch, derived from `src/lib/notion.ts`. |
| `scripts/build.ts` | `state/` + `learn/` → `dashboard.html`. |
| `scripts/refresh.ts` | Ahrefs + GA4 + Notion → `state/metrics.json`, `state/tasks.json`. |
| `test/*.test.ts` | One test file per lib module. |

---

### Task 1: Retire the Next.js app, preserve the fetchers

**Files:**
- Create: `lib/` (move target), `test/` (empty dir with `.gitkeep`)
- Modify: `package.json`, `.gitignore`
- Delete: `src/app/`, `src/components/`, `src/middleware.ts`, `src/lib/kv.ts`, `src/lib/notion-sync.ts`, `src/lib/gsc.ts`, `src/lib/snapshot.ts`, `src/lib/clients.ts`, `src/lib/trend.ts`, `src/lib/types.ts`, `vercel.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`
- Rewrite: `tsconfig.json` (editor type-checking only; Node does not typecheck)
- Keep, though it becomes orphaned: `data/cavallo-history.ts` (see Step 8 — do NOT delete it)
- Move: `src/lib/ahrefs.ts` → `lib/ahrefs.ts`, `src/lib/ga4.ts` → `lib/ga4.ts`, `src/lib/google-auth.ts` → `lib/google-auth.ts`, `src/lib/notion.ts` → `lib/notion-tasks.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `data/cavallo-history.ts` retained with an explanatory header (it loses its only two importers in this task and would otherwise read as dead code). `lib/` containing four fetcher files that do not yet compile (they import deleted modules — Task 2 and Task 7 fix them). `package.json` with `"type": "module"` and a `test` script.

- [ ] **Step 1: Move the four files worth keeping**

```bash
mkdir -p lib test
git mv src/lib/ahrefs.ts lib/ahrefs.ts
git mv src/lib/ga4.ts lib/ga4.ts
git mv src/lib/google-auth.ts lib/google-auth.ts
git mv src/lib/notion.ts lib/notion-tasks.ts
touch test/.gitkeep
```

- [ ] **Step 2: Delete the retired app**

```bash
git rm -r --quiet src/app src/components
git rm --quiet src/middleware.ts src/lib/kv.ts src/lib/notion-sync.ts \
  src/lib/gsc.ts src/lib/snapshot.ts src/lib/clients.ts src/lib/trend.ts src/lib/types.ts
git rm --quiet vercel.json next.config.ts postcss.config.mjs eslint.config.mjs
```

- [ ] **Step 3: Rewrite `package.json`**

```json
{
  "name": "cavallo-seo-project",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test \"test/**/*.test.ts\"",
    "build": "node --env-file=.env.local scripts/build.ts",
    "refresh": "node --env-file=.env.local scripts/refresh.ts"
  },
  "dependencies": {
    "@notionhq/client": "^5.22.0",
    "googleapis": "^173.0.0"
  },
  "devDependencies": {
    "@types/node": "^20"
  }
}
```

- [ ] **Step 4: Add generated output to `.gitignore`**

Append these lines to `.gitignore`:

```
# Generated dashboard — regenerate with `npm run build`
dashboard.html
```

- [ ] **Step 5: Replace `tsconfig.json` with an editor-only config**

Node strips types without checking them, so this exists purely so an editor does not flag every
`.ts` import as an error:

```json
{
  "compilerOptions": {
    "target": "es2023",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["config.ts", "lib/**/*.ts", "scripts/**/*.ts", "test/**/*.ts"]
}
```

- [ ] **Step 6: Remove the stale dependency tree**

```bash
rm -rf node_modules package-lock.json
npm install
```

Expected: installs only `@notionhq/client`, `googleapis`, `@types/node` and their transitive deps. No `next`, `react`, or `@vercel/kv`.

- [ ] **Step 7: Verify the test runner works**

```bash
npm test
```

Expected: exits 0 with `# pass 0` / `# fail 0`. No test files exist yet; this confirms the runner and the glob.

- [ ] **Step 8: Mark `data/cavallo-history.ts` as deliberately retained**

Its only two importers (`src/lib/snapshot.ts` and `src/app/api/cron/refresh/route.ts`) were
deleted in Step 2, so it now has none. It is still the ONLY in-repo copy of 36 target keywords
with their volume, difficulty, and position history — `state/keywords.csv` does not exist until
the Notion extraction happens. Without this header, a later session correctly identifies it as
dead code and deletes real data.

Insert at the very top of the file:

```typescript
// RETAINED DELIBERATELY — has no importers, and that is expected (2026-08-04).
//
// This is the only in-repo copy of 36 target keywords with volume, KD, and
// position history, plus the original pillarPages / projectContext content.
// state/keywords.csv does not exist yet: the full 86-keyword map lives in
// Notion and arrives via the Phase 0 extraction.
//
// DO NOT DELETE as dead code. Once state/keywords.csv exists and has been
// checked to cover these 36 keywords, this file can go.
```

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "refactor: retire Next.js app, preserve Ahrefs/GA4/Notion fetchers

The app's storage layer (@vercel/kv) is a discontinued product, it had 23
silent-failure paths, and it overwrote state nightly so it could not report
progress over time. Recoverable from history if ever needed."
```

---

### Task 2: Config, types, and a correct CSV parser

**Files:**
- Create: `config.ts`, `lib/types.ts`, `lib/csv.ts`, `test/csv.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `config` object from `config.ts` with fields `name: string`, `projectStart: string`, `ga4PropertyId: string`, `ahrefs: { target: string; mode: string }`, `competitors: { target: string; mode: string; label: string }[]`, `notionTasksDataSourceId: string`; and `type Config = typeof config`.
  - `parseCsv(text: string): string[][]` and `serializeCsv(rows: string[][]): string` from `lib/csv.ts`.
  - Types from `lib/types.ts`: `Role`, `PageRow`, `MonthPoint`, `Metrics`, `Task`, `TaskSnapshot`, `LearnDoc`, `ProjectState`.

- [ ] **Step 1: Write the failing test**

Create `test/csv.test.ts`:

```typescript
import { test } from "node:test";
import assert from "node:assert";
import { parseCsv, serializeCsv } from "../lib/csv.ts";

test("parses a simple row", () => {
  assert.deepEqual(parseCsv("a,b,c"), [["a", "b", "c"]]);
});

test("parses quoted field containing commas", () => {
  const input = 'url,"AUTO. faq, wc=1100, tr=0",Auto';
  assert.deepEqual(parseCsv(input), [["url", "AUTO. faq, wc=1100, tr=0", "Auto"]]);
});

test("parses escaped double quotes inside a quoted field", () => {
  assert.deepEqual(parseCsv('a,"he said ""hi""",c'), [["a", 'he said "hi"', "c"]]);
});

test("parses multiple rows and ignores a trailing newline", () => {
  assert.deepEqual(parseCsv("a,b\nc,d\n"), [["a", "b"], ["c", "d"]]);
});

test("preserves empty trailing field", () => {
  assert.deepEqual(parseCsv("a,b,"), [["a", "b", ""]]);
});

test("serialize quotes only fields that need it", () => {
  assert.equal(serializeCsv([["a", "b,c", 'd"e']]), 'a,"b,c","d""e"');
});

test("round-trips the real evidence format", () => {
  const rows = [[
    "https://cavallo-inc.com/faq/x/",
    "Pillar 1 — Hoof Boots",
    "KEEP-SPOKE",
    "",
    "AUTO. faq, wc=1100, tr=0, li=11. FAQ (boots (commercial)) — keep as spoke.",
    "Auto",
    "No",
  ]];
  assert.deepEqual(parseCsv(serializeCsv(rows)), rows);
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test
```

Expected: FAIL — `Cannot find module '../lib/csv.ts'`.

- [ ] **Step 3: Implement `lib/csv.ts`**

```typescript
/** Minimal RFC4180 CSV. Hand-rolled to honour the zero-dependency constraint. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch !== "\r") {
      field += ch;
    }
  }

  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

export function serializeCsv(rows: string[][]): string {
  return rows
    .map((row) =>
      row
        .map((f) =>
          /[",\n\r]/.test(f) ? `"${f.replaceAll('"', '""')}"` : f
        )
        .join(",")
    )
    .join("\n");
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test
```

Expected: PASS, 7 tests.

- [ ] **Step 5: Create `config.ts`**

```typescript
/** The one client this repo serves. Replaces the former multi-client registry. */
export const config = {
  name: "Cavallo Inc.",
  projectStart: "2026-06-01",
  ga4PropertyId: "319655127",
  ahrefs: { target: "cavallo-inc.com", mode: "subdomains" },
  competitors: [
    { target: "scootboots.com", mode: "subdomains", label: "Scoot Boots" },
    { target: "renegadehoofboots.com", mode: "subdomains", label: "Renegade Hoof Boots" },
    { target: "easycareinc.com", mode: "subdomains", label: "EasyCare" },
    { target: "softrideboots.com", mode: "subdomains", label: "Softride Boots" },
  ],
  /** Project Tasks. The ONLY Notion object this repo touches, and read-only. */
  notionTasksDataSourceId: "ff3ec7b0-97d8-42a0-b323-5eb8badc3a1e",
};

export type Config = typeof config;
```

- [ ] **Step 6: Create `lib/types.ts`**

```typescript
export type Role =
  | "KEEP-CANONICAL"
  | "OPTIMIZE"
  | "KEEP-SPOKE"
  | "MERGE+301"
  | "REWRITE"
  | "NOINDEX"
  | "PRUNE";

export type PageRow = {
  url: string;
  pillar: string;
  role: Role;
  /** A live URL, or a "(NEW) ..." placeholder meaning the destination is unbuilt. */
  destinationUrl: string;
  evidence: string;
  source: "Seed" | "Auto";
  needsReview: boolean;
};

export type MonthPoint = { month: string; value: number };

export type Metrics = {
  fetchedAt: string;
  /** Ahrefs organic traffic ESTIMATE. Not measured clicks — GSC is blocked. */
  visibility: MonthPoint[];
  sessions: MonthPoint[];
  revenue: MonthPoint[];
  competitors: { label: string; traffic: number }[];
};

export type Task = { name: string; status: string; due: string | null };

export type TaskSnapshot = { fetchedAt: string; tasks: Task[] };

export type LearnDoc = { slug: string; title: string; body: string };

export type ProjectState = {
  whereWeAre: string;
  decisions: string;
  nextActions: string;
  learn: LearnDoc[];
  pages: PageRow[];
  metrics: Metrics | null;
  tasks: TaskSnapshot | null;
};
```

- [ ] **Step 7: Commit**

```bash
git add config.ts lib/types.ts lib/csv.ts test/csv.test.ts
git commit -m "feat: add config, shared types, and RFC4180 CSV parser"
```

---

### Task 3: Read and write `state/pages.csv`

**Files:**
- Create: `lib/pages.ts`, `test/pages.test.ts`, `state/pages.csv`
- Modify: `site-audit/build_disposition_map.py` (header warning only)

**Interfaces:**
- Consumes: `parseCsv`, `serializeCsv` from `lib/csv.ts`; `PageRow`, `Role` from `lib/types.ts`.
- Produces: `PAGES_HEADER: string[]`, `parsePages(text: string): PageRow[]`, `serializePages(rows: PageRow[]): string`, `readPages(path?: string): PageRow[]`, `writePages(rows: PageRow[], path?: string): void`. Default path is `state/pages.csv`.

- [ ] **Step 1: Write the failing test**

Create `test/pages.test.ts`:

```typescript
import { test } from "node:test";
import assert from "node:assert";
import { parsePages, serializePages } from "../lib/pages.ts";

const CSV = [
  "url,pillar,role,destination_url,evidence,source,needs_review",
  'https://x.com/a/,Pillar 1 — Hoof Boots,KEEP-SPOKE,,"AUTO. faq, wc=1100",Auto,No',
  'https://x.com/b/,Pillar 2 — Hoof Health,MERGE+301,(NEW) Pillar 2 — Hoof Abscess spoke,"SEED.",Seed,Yes',
].join("\n");

test("parses rows into PageRow objects", () => {
  const rows = parsePages(CSV);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].url, "https://x.com/a/");
  assert.equal(rows[0].role, "KEEP-SPOKE");
  assert.equal(rows[0].evidence, "AUTO. faq, wc=1100");
});

test("maps needs_review to a boolean", () => {
  const rows = parsePages(CSV);
  assert.equal(rows[0].needsReview, false);
  assert.equal(rows[1].needsReview, true);
});

test("preserves a (NEW) destination verbatim", () => {
  const rows = parsePages(CSV);
  assert.equal(rows[1].destinationUrl, "(NEW) Pillar 2 — Hoof Abscess spoke");
});

test("rejects an unknown role rather than guessing", () => {
  const bad = "url,pillar,role,destination_url,evidence,source,needs_review\nhttps://x.com/,None,DELETE,,e,Auto,No";
  assert.throws(() => parsePages(bad), /Unknown role "DELETE"/);
});

test("rejects a header that does not match the expected schema", () => {
  assert.throws(() => parsePages("url,role\nhttps://x.com/,PRUNE"), /Unexpected header/);
});

test("round-trips without loss", () => {
  assert.deepEqual(parsePages(serializePages(parsePages(CSV))), parsePages(CSV));
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test
```

Expected: FAIL — `Cannot find module '../lib/pages.ts'`.

- [ ] **Step 3: Implement `lib/pages.ts`**

```typescript
import { readFileSync, writeFileSync } from "node:fs";
import { parseCsv, serializeCsv } from "./csv.ts";
import type { PageRow, Role } from "./types.ts";

export const PAGES_HEADER = [
  "url", "pillar", "role", "destination_url", "evidence", "source", "needs_review",
];

const ROLES: Role[] = [
  "KEEP-CANONICAL", "OPTIMIZE", "KEEP-SPOKE", "MERGE+301", "REWRITE", "NOINDEX", "PRUNE",
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
      r.url, r.pillar, r.role, r.destinationUrl, r.evidence, r.source,
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
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test
```

Expected: PASS, 13 tests total.

- [ ] **Step 5: Migrate the real data into `state/`**

```bash
mkdir -p state
cp site-audit/content_disposition_map.csv state/pages.csv
node --input-type=module -e '
import { readPages } from "./lib/pages.ts";
const rows = readPages();
console.log("rows:", rows.length);
console.log("needsReview:", rows.filter(r => r.needsReview).length);
'
```

Expected: `rows: 1154` and `needsReview: 47`. If either number differs, stop — the source data is not what the plan assumed.

- [ ] **Step 6: Warn future sessions off regenerating the file**

Insert into `site-audit/build_disposition_map.py`, immediately after the closing `"""` of the module docstring:

```python
# ---------------------------------------------------------------------------
# RETIRED AS A GENERATOR (2026-08-04).
#
# state/pages.csv is now the canonical record and carries Mark's human review
# decisions. Re-running this script would overwrite that judgment with
# heuristics. It is kept for reference only — to understand HOW rows were
# originally classified, not to rebuild them.
#
# To change a page's role, edit state/pages.csv (see lib/pages.ts).
# ---------------------------------------------------------------------------
```

- [ ] **Step 7: Commit**

```bash
git add lib/pages.ts test/pages.test.ts state/pages.csv site-audit/build_disposition_map.py
git commit -m "feat: read/write state/pages.csv; retire the classifier as a generator"
```

---

### Task 4: Derived queries, including blocked merges

**Files:**
- Create: `lib/queries.ts`, `test/queries.test.ts`

**Interfaces:**
- Consumes: `PageRow`, `Role` from `lib/types.ts`.
- Produces: `isBlockedDestination(destinationUrl: string): boolean`, `roleCounts(rows: PageRow[]): Record<string, number>`, `needsReview(rows: PageRow[]): PageRow[]`, `actionableMerges(rows: PageRow[]): PageRow[]`, `blockedMerges(rows: PageRow[]): { destination: string; count: number }[]` (sorted by count descending).

- [ ] **Step 1: Write the failing test**

Create `test/queries.test.ts`:

```typescript
import { test } from "node:test";
import assert from "node:assert";
import {
  isBlockedDestination, roleCounts, needsReview, actionableMerges, blockedMerges,
} from "../lib/queries.ts";
import type { PageRow } from "../lib/types.ts";

function row(over: Partial<PageRow> = {}): PageRow {
  return {
    url: "https://x.com/a/", pillar: "None", role: "PRUNE", destinationUrl: "",
    evidence: "", source: "Auto", needsReview: false, ...over,
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
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test
```

Expected: FAIL — `Cannot find module '../lib/queries.ts'`.

- [ ] **Step 3: Implement `lib/queries.ts`**

```typescript
import type { PageRow } from "./types.ts";

/**
 * A destination that is not yet a real URL. The 301 safety rule: never redirect
 * a page before its destination has live content.
 */
export function isBlockedDestination(destinationUrl: string): boolean {
  return destinationUrl.trimStart().startsWith("(NEW)");
}

export function roleCounts(rows: PageRow[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const r of rows) counts[r.role] = (counts[r.role] ?? 0) + 1;
  return counts;
}

export function needsReview(rows: PageRow[]): PageRow[] {
  return rows.filter((r) => r.needsReview);
}

export function actionableMerges(rows: PageRow[]): PageRow[] {
  return rows.filter(
    (r) => r.role === "MERGE+301" && !isBlockedDestination(r.destinationUrl)
  );
}

export function blockedMerges(rows: PageRow[]): { destination: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const r of rows) {
    if (r.role === "MERGE+301" && isBlockedDestination(r.destinationUrl)) {
      counts.set(r.destinationUrl, (counts.get(r.destinationUrl) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([destination, count]) => ({ destination, count }))
    .sort((a, b) => b.count - a.count || a.destination.localeCompare(b.destination));
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test
```

Expected: PASS, 20 tests total.

- [ ] **Step 5: Sanity-check against real data**

```bash
node --input-type=module -e '
import { readPages } from "./lib/pages.ts";
import { blockedMerges, actionableMerges } from "./lib/queries.ts";
const rows = readPages();
console.log("actionable merges:", actionableMerges(rows).length);
console.log("blocked merges:", blockedMerges(rows).reduce((n, b) => n + b.count, 0));
console.table(blockedMerges(rows));
'
```

Expected: 72 actionable, 27 blocked, across 5 distinct `(NEW)` destinations.

- [ ] **Step 6: Commit**

```bash
git add lib/queries.ts test/queries.test.ts
git commit -m "feat: derived page queries with 301-safety blocked-merge detection"
```

---

### Task 5: Assemble `ProjectState` from disk

**Files:**
- Create: `lib/state.ts`, `test/state.test.ts`, `state/where-we-are.md`, `state/decisions.md`, `state/next-actions.md`, `learn/.gitkeep`

**Interfaces:**
- Consumes: `readPages` from `lib/pages.ts`; `ProjectState`, `LearnDoc`, `Metrics`, `TaskSnapshot` from `lib/types.ts`.
- Produces: `readState(root?: string): ProjectState`, `readLearnDocs(dir: string): LearnDoc[]`. `metrics` and `tasks` are `null` when their JSON files are absent. Default root is the repo root (`"."`).

- [ ] **Step 1: Write the failing test**

Create `test/state.test.ts`:

```typescript
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

test("metrics and tasks are null when their files are absent", () => {
  const state = readState(fixture());
  assert.equal(state.metrics, null);
  assert.equal(state.tasks, null);
});

test("reads metrics when present", () => {
  const root = fixture();
  writeFileSync(
    join(root, "state", "metrics.json"),
    JSON.stringify({ fetchedAt: "2026-08-04T00:00:00Z", visibility: [{ month: "2026-07", value: 10 }], sessions: [], revenue: [], competitors: [] })
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
  assert.throws(() => readState(root), /where-we-are\.md/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test
```

Expected: FAIL — `Cannot find module '../lib/state.ts'`.

- [ ] **Step 3: Implement `lib/state.ts`**

```typescript
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";
import { readPages } from "./pages.ts";
import type { LearnDoc, Metrics, ProjectState, TaskSnapshot } from "./types.ts";

function readRequired(path: string): string {
  if (!existsSync(path)) {
    throw new Error(`Missing required state file: ${path}`);
  }
  return readFileSync(path, "utf8");
}

function readOptionalJson<T>(path: string): T | null {
  return existsSync(path) ? (JSON.parse(readFileSync(path, "utf8")) as T) : null;
}

export function readLearnDocs(dir: string): LearnDoc[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((file) => {
      const body = readFileSync(join(dir, file), "utf8");
      const slug = basename(file, ".md");
      const heading = body.match(/^#\s+(.+)$/m);
      return { slug, title: heading ? heading[1].trim() : slug, body };
    });
}

export function readState(root: string = "."): ProjectState {
  const s = (f: string) => join(root, "state", f);
  return {
    whereWeAre: readRequired(s("where-we-are.md")),
    decisions: readRequired(s("decisions.md")),
    nextActions: readRequired(s("next-actions.md")),
    pages: readPages(s("pages.csv")),
    metrics: readOptionalJson<Metrics>(s("metrics.json")),
    tasks: readOptionalJson<TaskSnapshot>(s("tasks.json")),
    learn: readLearnDocs(join(root, "learn")),
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test
```

Expected: PASS, 26 tests total.

- [ ] **Step 5: Seed the three state documents with real project content**

Create `state/where-we-are.md`. Content is drawn from `PILLAR-BUILD-PLAN.md` — the five-step path, four locked decisions, and the current position:

```markdown
# Where we are

**Step 3 of 5** — Mark reviews the 47 judgment calls in the Content Disposition Map.

## The five steps

1. ✅ **Lock 4 architecture decisions** — done 2026-06-16. See `decisions.md`.
2. ✅ **Build the Content Disposition Map** — done 2026-06-16. 1,154 rows, one role per URL,
   which is what guarantees no cannibalization. Now `state/pages.csv`.
3. ▶️ **Review the 47 uncertain calls** — in progress. The other 1,107 rows are mechanical.
4. ⬜ **Global quick wins** — noindex the tag/auto archives via one Yoast taxonomy setting
   (covers 235 rows); prune obvious dead weight.
5. ⬜ **Build pillars in waves** — Pillar 1 → 2 → 3. Publish each pillar before running its 301s.

## What's blocked

**27 of the 99 merges cannot run yet.** They point at 5 pages that do not exist:

- (NEW) Pillar 2 — Hoof Health & Conditions page — 12 merges waiting
- (NEW) Pillar 3 — Barefoot Trimming spoke — 4
- (NEW) Pillar 2 — White Line Disease spoke — 4
- (NEW) Pillar 2 — Hoof Abscess spoke — 4
- (NEW) Pillar 3 — Wild Horse Hooves spoke — 3

This is the 301 safety rule: redirecting a page before its destination has live content throws
away the ranking signal instead of passing it on.

## Known limits on the numbers

Google Search Console is permission-blocked for cavallo-inc.com, so every traffic figure here is
an **Ahrefs estimate**, not measured clicks. Only ~72 of 1,154 pages register any organic traffic
at all. 723 pages have zero internal inbound links; 632 have no meta description.
```

Create `state/decisions.md`:

```markdown
# Decisions

Every decision, why it was made, and when. Newest last.

## 2026-06-16 — Founder content merges into the Laminitis spoke

There is no single "Founder" page to absorb — it is a scatter of thin posts, all with roughly
zero traffic and zero links. MERGE+301 all of them into
`/your-cavallo-laminitis-healing-plan/` and repurpose the "foundered mare" customer stories as
social-proof blocks inside the combined guide.

Left out deliberately: the two founder videos (already noindexed) and
`/newsletter/may-2-journal-founders-insights/`, which is a false positive — "founder" there means
the company founder, not the disease.

## 2026-06-16 — DSLD is excluded

Degenerative Suspensory Ligament Desmitis is a connective-tissue disease, not hoof-seated.
Including it would dilute the pillar's topical authority. No page.

## 2026-06-16 — Navicular consolidates to one educational spoke

Canonical is `/is-navicular-disease-always-the-beginning-of-the-end/` (1,936 words, 129 visits,
already ranks for "when to euthanize a horse with navicular"). Add a "best boots for navicular"
section so it carries commercial intent, then merge both commercial pages and six thin posts into
it.

Kept separate: `/faq/cavallo-hoof-boots-for-therapy-and-rehabilitation/` only *mentions*
navicular. It is a therapy/rehab page and becomes its own Pillar 1 spoke.

## 2026-06-16 — Diet becomes one educational spoke under Pillar 2

The literal hoof-nutrition angle has almost no search demand (`hoof nutrition` 30/mo,
`minerals for horse hooves` 0). So the spoke targets `horse diet` (800, KD21) and
`equine nutrition` (400, KD21) and stays educational — diet leads to healthy hoof.

Canonical is `/equine-nutrition/`. Four thin founder-voice posts merge into it.

The easy commercial supplement terms (`horse hoof supplement` KD0, `biotin for horses` KD1) are
deliberately skipped: Cavallo sells boots, not supplements, and chasing them would dilute the
pillar's focus.

## 2026-08-04 — Notion narrows to task management only

The Cavallo team does not use the Notion workspace, so pushing keywords, visibility, sessions,
revenue, and competitor data there was wasted effort. That write-back is removed. Notion keeps
one job — the task database — because it is genuinely good at task management and files are not.

Project state moves to version-controlled files in this repo, rendered to `dashboard.html`.
```

Create `state/next-actions.md`:

```markdown
# Next actions

Ordered. Top item first.

## 1. Review the 47 flagged rows

**Why first:** every later step depends on the map being correct. Step 4 mass-noindexes 235
pages and Step 5 runs 301s — both are hard to walk back. The 47 flagged rows are the
equity-bearing pages, where a wrong call costs real traffic.

**Unblocks:** Steps 4 and 5.

**How:** conversationally with Claude, in batches. Claude presents each page with its traffic,
inbound links, and the reasoning behind its classification; Mark decides; the call and its
reasoning are recorded.

**Two classifier caveats to watch for:** "boots" appears on nearly every post because Cavallo is
a boot company, so some Pillar 1 tags are loose. And merges pointing at `(NEW)` destinations
cannot run until those pages exist.

## 2. Noindex the tag and auto archives

**Why:** one Yoast taxonomy setting clears 235 rows. Highest ratio of result to effort in the
project.

**Unblocks:** nothing, but removes 235 rows of noise from every view.

## 3. Build Pillar 1 — Hoof Boot Guide

**Why before 2 and 3:** it enriches `/product-category/hoof-boot/`, already the strongest asset
at roughly 1,286 visits a month. Lowest risk, because the page exists and ranks.

**Unblocks:** 24 merges pointing at it.

**Rule:** publish the pillar first, confirm it covers the topic, *then* run the 301s.
```

- [ ] **Step 6: Verify against real data**

```bash
node --input-type=module -e '
import { readState } from "./lib/state.ts";
const s = readState();
console.log("pages:", s.pages.length, "| learn docs:", s.learn.length);
console.log("metrics:", s.metrics === null ? "none yet" : "present");
'
```

Expected: `pages: 1154 | learn docs: 0` and `metrics: none yet`.

- [ ] **Step 7: Commit**

```bash
git add lib/state.ts test/state.test.ts state/ learn/.gitkeep
git commit -m "feat: assemble ProjectState from disk; seed the three state documents"
```

---

### Task 6: Render the dashboard

**Files:**
- Create: `lib/render.ts`, `test/render.test.ts`

**Interfaces:**
- Consumes: `ProjectState`, `PageRow` from `lib/types.ts`; `roleCounts`, `needsReview`, `blockedMerges` from `lib/queries.ts`.
- Produces: `renderDashboard(state: ProjectState): string` — a complete standalone HTML document with three tabs (`where-we-are`, `whats-next`, `why`), inline CSS and JS, no external requests.

- [ ] **Step 1: Write the failing test**

Create `test/render.test.ts`:

```typescript
import { test } from "node:test";
import assert from "node:assert";
import { renderDashboard } from "../lib/render.ts";
import type { ProjectState } from "../lib/types.ts";

function state(over: Partial<ProjectState> = {}): ProjectState {
  return {
    whereWeAre: "# Where we are\nStep 3 of 5.",
    decisions: "# Decisions\nDecided things.",
    nextActions: "# Next actions\nReview 47 rows.",
    learn: [{ slug: "why-301", title: "Why 301 beats noindex", body: "# Why 301 beats noindex\n\nEquity transfers." }],
    pages: [
      { url: "https://x.com/a/", pillar: "None", role: "PRUNE", destinationUrl: "", evidence: "thin", source: "Auto", needsReview: false },
      { url: "https://x.com/b/", pillar: "Pillar 2 — Hoof Health", role: "MERGE+301", destinationUrl: "(NEW) Pillar 2 — Hoof Abscess spoke", evidence: "seeded", source: "Seed", needsReview: true },
    ],
    metrics: {
      fetchedAt: "2026-08-04T00:00:00Z",
      visibility: [{ month: "2026-07", value: 1286 }],
      sessions: [], revenue: [], competitors: [],
    },
    tasks: null,
    ...over,
  };
}

test("produces a standalone document with no external requests", () => {
  const html = renderDashboard(state());
  assert.match(html, /^<!DOCTYPE html>/);
  assert.doesNotMatch(html, /<script[^>]+src=/);
  assert.doesNotMatch(html, /<link[^>]+stylesheet/);
});

test("renders all three tabs", () => {
  const html = renderDashboard(state());
  for (const id of ["where-we-are", "whats-next", "why"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
});

test("labels traffic figures as estimates", () => {
  const html = renderDashboard(state());
  assert.match(html, /Ahrefs estimate/i);
});

test("surfaces blocked merges with their reason", () => {
  const html = renderDashboard(state());
  assert.match(html, /\(NEW\) Pillar 2 — Hoof Abscess spoke/);
  assert.match(html, /301 safety rule/i);
});

test("includes every page row in the searchable table", () => {
  const html = renderDashboard(state());
  assert.match(html, /https:\/\/x\.com\/a\//);
  assert.match(html, /https:\/\/x\.com\/b\//);
});

test("escapes HTML in page data", () => {
  const html = renderDashboard(
    state({
      pages: [{ url: "https://x.com/<script>alert(1)</script>/", pillar: "None", role: "PRUNE", destinationUrl: "", evidence: "a & b", source: "Auto", needsReview: false }],
    })
  );
  assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /a &amp; b/);
});

test("states plainly when metrics have never been fetched", () => {
  const html = renderDashboard(state({ metrics: null }));
  assert.match(html, /never been refreshed/i);
});

test("shows the review count", () => {
  const html = renderDashboard(state());
  assert.match(html, /1 row needs review|needs review/i);
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test
```

Expected: FAIL — `Cannot find module '../lib/render.ts'`.

- [ ] **Step 3: Implement `lib/render.ts`**

```typescript
import { blockedMerges, needsReview, roleCounts } from "./queries.ts";
import type { PageRow, ProjectState } from "./types.ts";

function esc(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Deliberately minimal markdown: headings, bold, code, lists, paragraphs. */
function md(src: string): string {
  const lines = src.split("\n");
  const out: string[] = [];
  let inList = false;

  const inline = (t: string) =>
    esc(t)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`(.+?)`/g, "<code>$1</code>");

  for (const line of lines) {
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    const li = line.match(/^\s*[-*]\s+(.*)$/);
    const ol = line.match(/^\s*\d+\.\s+(.*)$/);

    if (li || ol) {
      if (!inList) { out.push("<ul>"); inList = true; }
      out.push(`<li>${inline((li ?? ol)![1])}</li>`);
      continue;
    }
    if (inList) { out.push("</ul>"); inList = false; }

    if (h) out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`);
    else if (line.trim() === "") out.push("");
    else out.push(`<p>${inline(line)}</p>`);
  }
  if (inList) out.push("</ul>");
  return out.join("\n");
}

function metricsBlock(state: ProjectState): string {
  if (!state.metrics) {
    return `<p class="warn">The numbers have <strong>never been refreshed</strong>.
      Run <code>npm run refresh</code> to fetch them.</p>`;
  }
  const latest = state.metrics.visibility.at(-1);
  return `
    <p class="metric">Organic traffic: <strong>${latest ? latest.value.toLocaleString() : "—"}</strong>
      <span class="qualifier">(${latest ? esc(latest.month) : "no data"} — Ahrefs estimate,
      not measured clicks; Search Console is blocked for this domain)</span></p>
    <p class="muted">Last refreshed ${esc(state.metrics.fetchedAt)}</p>`;
}

function blockedBlock(state: ProjectState): string {
  const blocked = blockedMerges(state.pages);
  if (blocked.length === 0) return "";
  const total = blocked.reduce((n, b) => n + b.count, 0);
  return `
    <h3>Blocked: ${total} merges cannot run yet</h3>
    <p>They point at pages that do not exist. The <strong>301 safety rule</strong>: redirecting a
      page before its destination has live content throws the ranking signal away instead of
      passing it on.</p>
    <ul>${blocked
      .map((b) => `<li><strong>${esc(b.destination)}</strong> — ${b.count} waiting</li>`)
      .join("")}</ul>`;
}

function pagesTable(pages: PageRow[]): string {
  const rows = pages
    .map(
      (p) => `<tr data-review="${p.needsReview}">
        <td><a href="${esc(p.url)}">${esc(p.url)}</a></td>
        <td>${esc(p.pillar)}</td>
        <td><span class="role">${esc(p.role)}</span></td>
        <td>${esc(p.destinationUrl)}</td>
        <td>${esc(p.evidence)}</td>
        <td>${p.needsReview ? "REVIEW" : ""}</td>
      </tr>`
    )
    .join("");

  return `
    <input id="filter" placeholder="Filter ${pages.length} pages by URL, pillar, role, or evidence…">
    <label><input type="checkbox" id="only-review"> Only rows needing review</label>
    <table id="pages">
      <thead><tr><th>URL</th><th>Pillar</th><th>Role</th><th>Destination</th><th>Evidence</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

export function renderDashboard(state: ProjectState): string {
  const counts = roleCounts(state.pages);
  const review = needsReview(state.pages);

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<title>Cavallo SEO — project state</title>
<style>
  :root { color-scheme: light dark; }
  body { font: 16px/1.6 system-ui, sans-serif; margin: 0 auto; max-width: 1100px; padding: 2rem; }
  nav button { font: inherit; padding: .6rem 1.2rem; border: 0; background: transparent; cursor: pointer; border-bottom: 3px solid transparent; }
  nav button[aria-selected="true"] { border-bottom-color: currentColor; font-weight: 600; }
  section[hidden] { display: none; }
  table { border-collapse: collapse; width: 100%; font-size: .82rem; }
  th, td { text-align: left; padding: .35rem .5rem; border-bottom: 1px solid #8883; vertical-align: top; }
  td a { word-break: break-all; }
  .role { font-family: ui-monospace, monospace; font-size: .78rem; }
  .warn { padding: .75rem 1rem; border-left: 4px solid #c93; background: #c9930f18; }
  .qualifier, .muted { color: #8a8a8a; font-weight: 400; font-size: .85rem; }
  .metric { font-size: 1.1rem; }
  .counts { display: flex; flex-wrap: wrap; gap: .5rem 1.25rem; padding: 0; list-style: none; }
  #filter { width: 100%; font: inherit; padding: .5rem; margin: 1rem 0 .5rem; }
</style></head>
<body>
<h1>Cavallo SEO — project state</h1>
<nav role="tablist">
  <button role="tab" aria-controls="where-we-are" aria-selected="true">Where we are</button>
  <button role="tab" aria-controls="whats-next" aria-selected="false">What's next</button>
  <button role="tab" aria-controls="why" aria-selected="false">Why</button>
</nav>

<section id="where-we-are">
  ${md(state.whereWeAre)}
  ${metricsBlock(state)}
  <h3>All ${state.pages.length} pages by role</h3>
  <ul class="counts">${Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([role, n]) => `<li><span class="role">${esc(role)}</span> ${n}</li>`)
    .join("")}</ul>
  <p>${review.length} row${review.length === 1 ? "" : "s"} needs review.</p>
</section>

<section id="whats-next" hidden>
  ${md(state.nextActions)}
  ${blockedBlock(state)}
</section>

<section id="why" hidden>
  ${state.learn.length === 0
    ? `<p class="warn">No explanatory documents written yet. They belong in <code>learn/</code>.</p>`
    : state.learn.map((d) => `<article>${md(d.body)}</article>`).join("\n<hr>\n")}
  <h2>Decisions</h2>
  ${md(state.decisions)}
  <h2>Every page and why</h2>
  ${pagesTable(state.pages)}
</section>

<script>
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  tabs.forEach((tab) => tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      const active = t === tab;
      t.setAttribute("aria-selected", String(active));
      panel.hidden = !active;
    });
  }));

  const filter = document.getElementById("filter");
  const onlyReview = document.getElementById("only-review");
  const rows = [...document.querySelectorAll("#pages tbody tr")];
  function apply() {
    const q = filter.value.toLowerCase();
    const only = onlyReview.checked;
    for (const row of rows) {
      const matchesText = row.textContent.toLowerCase().includes(q);
      const matchesReview = !only || row.dataset.review === "true";
      row.hidden = !(matchesText && matchesReview);
    }
  }
  filter.addEventListener("input", apply);
  onlyReview.addEventListener("change", apply);
</script>
</body></html>`;
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test
```

Expected: PASS, 34 tests total.

- [ ] **Step 5: Commit**

```bash
git add lib/render.ts test/render.test.ts
git commit -m "feat: render three-tab dashboard with escaped output and estimate labelling"
```

---

### Task 7: The build script

**Files:**
- Create: `scripts/build.ts`

**Interfaces:**
- Consumes: `readState` from `lib/state.ts`; `renderDashboard` from `lib/render.ts`.
- Produces: `dashboard.html` at the repo root. Exits non-zero with a readable message on failure.

- [ ] **Step 1: Write `scripts/build.ts`**

```typescript
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
```

- [ ] **Step 2: Run it**

Note: `npm run build` uses `--env-file=.env.local`, which does not exist yet. Run directly for now:

```bash
node scripts/build.ts
```

Expected: `Wrote dashboard.html — 1154 pages, 0 explainers, metrics NOT YET FETCHED.`

- [ ] **Step 3: Verify the output is genuinely standalone**

```bash
test -f dashboard.html && grep -c "src=\"http\|stylesheet" dashboard.html
```

Expected: `0` matches — nothing loaded from the network.

- [ ] **Step 4: Open it and confirm all three tabs work**

```bash
open dashboard.html
```

Confirm by hand: the three tabs switch; the filter box narrows the 1,154 rows; "Only rows needing review" reduces the table to 47; traffic is labelled an Ahrefs estimate.

- [ ] **Step 5: Confirm the generated file is not tracked**

```bash
git status --short dashboard.html
```

Expected: no output — it is gitignored.

- [ ] **Step 6: Commit**

```bash
git add scripts/build.ts
git commit -m "feat: add build script generating standalone dashboard.html"
```

---

### Task 8: Read Notion tasks, loudly

**Files:**
- Modify: `lib/notion-tasks.ts` (rewrite the file moved in Task 1)
- Create: `lib/env.ts`, `test/env.test.ts`

**Interfaces:**
- Consumes: `config` from `config.ts`; `Task`, `TaskSnapshot` from `lib/types.ts`.
- Produces: `requireEnv(name: string): string` from `lib/env.ts`; `fetchTasks(): Promise<TaskSnapshot>` from `lib/notion-tasks.ts`. `fetchTasks` throws on a missing token or an API failure — it never returns an empty list to paper over a problem.

- [ ] **Step 1: Write the failing test**

Create `test/env.test.ts`:

```typescript
import { test } from "node:test";
import assert from "node:assert";
import { requireEnv } from "../lib/env.ts";

test("returns the value when set", () => {
  process.env.CAVALLO_TEST_VAR = "abc";
  assert.equal(requireEnv("CAVALLO_TEST_VAR"), "abc");
  delete process.env.CAVALLO_TEST_VAR;
});

test("throws naming the variable when unset", () => {
  delete process.env.CAVALLO_MISSING_VAR;
  assert.throws(() => requireEnv("CAVALLO_MISSING_VAR"), /CAVALLO_MISSING_VAR/);
});

test("throws when set to an empty string", () => {
  process.env.CAVALLO_EMPTY_VAR = "";
  assert.throws(() => requireEnv("CAVALLO_EMPTY_VAR"), /CAVALLO_EMPTY_VAR/);
  delete process.env.CAVALLO_EMPTY_VAR;
});

test("the message says how to fix it", () => {
  delete process.env.CAVALLO_MISSING_VAR;
  assert.throws(() => requireEnv("CAVALLO_MISSING_VAR"), /\.env\.local/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test
```

Expected: FAIL — `Cannot find module '../lib/env.ts'`.

- [ ] **Step 3: Implement `lib/env.ts`**

```typescript
/**
 * Credential gate. Throws rather than returning a falsy value, because the
 * retired app's habit of silently continuing without credentials is exactly
 * how it came to display June data labelled as current.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}.\n` +
        `Add it to .env.local in the repo root, then re-run.\n` +
        `Required: NOTION_TOKEN, AHREFS_API_TOKEN, GOOGLE_CLIENT_ID, ` +
        `GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN`
    );
  }
  return value;
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test
```

Expected: PASS, 38 tests total.

- [ ] **Step 5: Rewrite `lib/notion-tasks.ts`**

Replace the whole file. The original silently returned `[]` when the token was missing and depended on the deleted `ClientConfig`:

```typescript
import { Client } from "@notionhq/client";
import { config } from "../config.ts";
import { requireEnv } from "./env.ts";
import type { Task, TaskSnapshot } from "./types.ts";

/**
 * Read the Notion Project Tasks database. READ-ONLY — nothing in this repo
 * writes to Notion. Throws on failure rather than returning an empty list,
 * so a broken connection can never look like "no tasks".
 */
export async function fetchTasks(): Promise<TaskSnapshot> {
  const notion = new Client({ auth: requireEnv("NOTION_TOKEN") });

  let response;
  try {
    response = await notion.dataSources.query({
      data_source_id: config.notionTasksDataSourceId,
      sorts: [{ property: "Due Date", direction: "ascending" }],
    });
  } catch (cause) {
    throw new Error(
      `Notion task fetch failed for data source ${config.notionTasksDataSourceId}. ` +
        `Confirm NOTION_TOKEN is valid and the integration has been shared with the ` +
        `Project Tasks database. Original error: ${
          cause instanceof Error ? cause.message : String(cause)
        }`
    );
  }

  const tasks: Task[] = response.results.map((page) => {
    if (!("properties" in page)) {
      throw new Error(`Notion returned a page without properties: ${page.id}`);
    }
    const props = page.properties;

    const titleProp = props.Task;
    const name =
      titleProp && "type" in titleProp && titleProp.type === "title"
        ? titleProp.title.map((t: { plain_text: string }) => t.plain_text).join("")
        : "Untitled";

    const statusProp = props.Status;
    const status =
      statusProp && "type" in statusProp && statusProp.type === "select" && statusProp.select
        ? statusProp.select.name
        : "Unknown";

    const dueProp = props["Due Date"];
    const due =
      dueProp && "type" in dueProp && dueProp.type === "date" && dueProp.date
        ? dueProp.date.start
        : null;

    return { name, status, due };
  });

  return { fetchedAt: new Date().toISOString(), tasks };
}
```

- [ ] **Step 6: Commit**

```bash
git add lib/env.ts lib/notion-tasks.ts test/env.test.ts
git commit -m "feat: read-only Notion task fetch that fails loudly on missing credentials"
```

---

### Task 9: The refresh script

**Files:**
- Modify: `lib/ahrefs.ts`, `lib/ga4.ts`, `lib/google-auth.ts`
- Create: `scripts/refresh.ts`, `.env.local.example`

**Interfaces:**
- Consumes: `config`/`Config` from `config.ts`; `requireEnv` from `lib/env.ts`; `fetchTasks` from `lib/notion-tasks.ts`; `MonthPoint`, `Metrics` from `lib/types.ts`.
- Produces: `state/metrics.json` and `state/tasks.json`. In `lib/ahrefs.ts`: `fetchAhrefsVisibility(): Promise<MonthPoint[]>`, `fetchAhrefsCompetitors(): Promise<{ label: string; traffic: number }[]>` — both now read `config` directly rather than taking a parameter, and both throw on failure. In `lib/ga4.ts`: `fetchGA4Data(): Promise<{ sessions: MonthPoint[]; revenue: MonthPoint[] }>`.

- [ ] **Step 1: Fix the imports and failure behaviour in `lib/ahrefs.ts`**

Replace lines 1–3 (the `ClientConfig`/`MonthPoint` imports and `API_BASE`) with:

```typescript
import { config } from "../config.ts";
import { requireEnv } from "./env.ts";
import type { MonthPoint } from "./types.ts";

const API_BASE = "https://api.ahrefs.com/v3";
```

Replace the whole `ahrefsFetch` function so it throws instead of returning `null`:

```typescript
async function ahrefsFetch(path: string, params: Record<string, string>) {
  const token = requireEnv("AHREFS_API_TOKEN");
  const url = new URL(`${API_BASE}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Ahrefs ${path} failed: ${res.status} ${res.statusText} — ${body}`);
  }
  return res.json();
}
```

Then change the two exported functions used by the refresh script to drop their `config` parameter and throw on unusable responses:

```typescript
export async function fetchAhrefsVisibility(): Promise<MonthPoint[]> {
  const data = await ahrefsFetch("/site-explorer/metrics-history", {
    target: config.ahrefs.target,
    mode: config.ahrefs.mode,
    history_grouping: "monthly",
    date_from: "2024-01-01",
    select: "date,org_traffic",
  });

  if (!data?.metrics) {
    throw new Error("Ahrefs metrics-history returned no metrics array");
  }

  return data.metrics.map((row: { date: string; org_traffic: number }) => ({
    month: row.date.slice(0, 7),
    value: row.org_traffic,
  }));
}

export async function fetchAhrefsCompetitors(): Promise<{ label: string; traffic: number }[]> {
  const targets = [
    { label: config.name, target: config.ahrefs.target, mode: config.ahrefs.mode },
    ...config.competitors,
  ];

  return Promise.all(
    targets.map(async (t) => {
      const data = await ahrefsFetch("/site-explorer/metrics", {
        target: t.target,
        mode: t.mode,
        date: new Date().toISOString().slice(0, 10),
      });
      return { label: t.label, traffic: data?.metrics?.org_traffic ?? 0 };
    })
  );
}
```

Delete `fetchAhrefsKeywords` entirely. It is unused by this plan, and its declared return type omitted the `rankingUrl` field it actually returned — a latent bug not worth carrying forward.

- [ ] **Step 2: Fix `lib/google-auth.ts`**

Change its credential reads to use `requireEnv` so a missing Google credential throws instead of returning `null`. Add at the top:

```typescript
import { requireEnv } from "./env.ts";
```

Replace the body of `getOAuth2Client` so it reads:

```typescript
export function getOAuth2Client() {
  const client = new google.auth.OAuth2(
    requireEnv("GOOGLE_CLIENT_ID"),
    requireEnv("GOOGLE_CLIENT_SECRET")
  );
  client.setCredentials({ refresh_token: requireEnv("GOOGLE_REFRESH_TOKEN") });
  return client;
}
```

- [ ] **Step 3: Fix `lib/ga4.ts`**

Replace lines 1–4 with:

```typescript
import { google } from "googleapis";
import { config } from "../config.ts";
import type { MonthPoint } from "./types.ts";
import { getOAuth2Client } from "./google-auth.ts";
```

Make three edits:

1. Change the signature and delete the now-dead null guard — `getOAuth2Client` throws on missing
   credentials as of Step 2, so `auth` can never be null. Replace lines 11-16 with:

```typescript
export async function fetchGA4Data(): Promise<{ sessions: MonthPoint[]; revenue: MonthPoint[] }> {
  const auth = getOAuth2Client();
```

2. Immediately after `const rows = response.data.rows ?? [];`, insert:

```typescript
  if (rows.length === 0) {
    throw new Error(
      `GA4 property ${config.ga4PropertyId} returned no rows for organic search since 2024-01-01`
    );
  }
```

3. Leave everything else — the loop and the final `return { sessions, revenue };` — unchanged.

- [ ] **Step 4: Write `scripts/refresh.ts`**

```typescript
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
```

- [ ] **Step 5: Document the required credentials**

Create `.env.local.example`:

```
# Copy to .env.local and fill in. Never commit .env.local.
# Notion — READ-ONLY access to the Project Tasks database.
# Internal integration token from https://www.notion.so/my-integrations
# The integration must be shared with the Project Tasks database.
NOTION_TOKEN=

# Ahrefs API v3
AHREFS_API_TOKEN=

# Google OAuth for GA4 property 319655127
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
```

`.gitignore` currently contains a bare `.env*`, which would silently ignore this example file
too. Add a negation immediately after that line, so the template is tracked while real secrets
never are:

```
.env*
!.env.local.example
```

Verify — this must print `TRACKED (correct)`:

```bash
git check-ignore -q .env.local.example && echo "STILL IGNORED - fix .gitignore" || echo "TRACKED (correct)"
```

- [ ] **Step 6: Verify the loud-failure behaviour**

```bash
node scripts/refresh.ts
```

Expected: exits 1 with `Refresh failed: Missing required environment variable ...` naming a variable and mentioning `.env.local`. This is the correct result before credentials exist — it proves the script does not silently produce empty data.

- [ ] **Step 7: Verify the tests still pass**

```bash
npm test
```

Expected: PASS, 38 tests.

- [ ] **Step 8: Commit**

```bash
git add lib/ahrefs.ts lib/ga4.ts lib/google-auth.ts scripts/refresh.ts .env.local.example .gitignore
git commit -m "feat: add refresh script; make all fetchers fail loudly on missing credentials"
```

---

### Task 10: Point the project docs at the new structure

**Files:**
- Modify: `README.md`, `PILLAR-BUILD-PLAN.md`, `AGENTS.md`

**Interfaces:**
- Consumes: nothing.
- Produces: documentation matching the built system. No code depends on this task.

- [ ] **Step 1: Replace `README.md`**

It is currently untouched `create-next-app` boilerplate describing an app that no longer exists.
Note the four-backtick fence — the content itself contains fenced blocks:

````markdown
# Cavallo SEO project

Project state for the Cavallo Inc. SEO engagement, as version-controlled files plus a
dashboard generated from them.

## Using it

```bash
npm run refresh   # pull fresh numbers from Ahrefs, GA4, and Notion tasks
npm run build     # regenerate dashboard.html
open dashboard.html
npm test
```

`npm run refresh` needs `.env.local` — copy `.env.local.example` and fill it in.
`npm run build` works without credentials; it just reports that metrics were never fetched.

## Where things live

| Path | What |
|---|---|
| `state/where-we-are.md` | Current step, what's blocked |
| `state/decisions.md` | Every decision, why, and when |
| `state/next-actions.md` | The ordered queue |
| `state/pages.csv` | All 1,154 pages and the single role each one has |
| `state/metrics.json` | Ahrefs and GA4 figures, snapshotted per refresh |
| `state/tasks.json` | Snapshot of the Notion task database |
| `learn/` | Why the strategy is what it is |
| `site-audit/` | The original one-off audit pipeline (Python) |
| `data/cavallo-history.ts` | Retained, unimported: the only offline copy of 36 keywords, pending the Notion extraction |

`dashboard.html` is generated and gitignored. `state/*.json` and `state/*.csv` are committed
deliberately — their diffs are the record of progress over time.

## How state changes

Tasks are managed in Notion and read from there. Everything else changes by editing the files in
`state/`, normally by asking Claude, so each change lands in git with its reasoning attached.

Nothing in this repo writes to Notion.

## Caveats that matter

Google Search Console is permission-blocked for cavallo-inc.com, so all traffic figures are
**Ahrefs estimates**, not measured clicks. Only ~72 of 1,154 pages register organic traffic.

`site-audit/build_disposition_map.py` is retired as a generator. `state/pages.csv` now holds
human review decisions and re-running the classifier would overwrite them.
````

- [ ] **Step 2: Correct the stale direction in `PILLAR-BUILD-PLAN.md`**

Replace line 4, which currently reads `**Deliverables go to Notion**, not code...`:

```markdown
**Deliverables live in this repo** as version-controlled state, surfaced through
`dashboard.html`. Notion keeps one job: the Project Tasks database, which is read-only from
here. Superseded by `docs/superpowers/specs/2026-08-04-project-dashboard-design.md`.
```

Then replace the `## ✅ Step 2 DONE` section's Notion pointers with `state/pages.csv`, keeping
the row counts and the "Page URL" title-property gotcha note for the historical record.

- [ ] **Step 3: Update `AGENTS.md`**

It currently warns only about Next.js docs. Next.js is gone:

```markdown
# Working in this repo

No framework. Node 22 runs TypeScript directly — no bundler, no transpiler, no build step.
Relative imports must include the `.ts` extension.

Read `docs/superpowers/specs/2026-08-04-project-dashboard-design.md` before changing structure.

## Rules

- **Nothing writes to Notion.** Read-only, task database only.
- **Fail loudly.** Never swallow an error and return empty or stale data in its place. The
  previous version of this project had 23 silent-failure paths and displayed two-month-old
  numbers as current.
- **Label traffic figures as Ahrefs estimates.** Search Console is blocked for this domain.
- **Never regenerate `state/pages.csv`** with `site-audit/build_disposition_map.py`. It holds
  human review decisions the classifier does not know about.
- Zero new dependencies without asking.
```

- [ ] **Step 4: Rebuild and confirm nothing broke**

```bash
npm test && node scripts/build.ts
```

Expected: 38 tests pass; `dashboard.html` regenerates with 1,154 pages.

- [ ] **Step 5: Commit**

```bash
git add README.md PILLAR-BUILD-PLAN.md AGENTS.md
git commit -m "docs: replace boilerplate README and correct the Notion-first direction"
```

---

## Out of scope for this plan

Three pieces of the spec are deliberately not tasks here, because they are not code:

1. **Phase 0 — extracting content from Notion.** Blocked on Mark authenticating `notion-cavallo`
   in an interactive terminal. Once done, the pillar playbooks and the 86-keyword map get pulled
   into `learn/` and `state/keywords.csv`. Note that `state/keywords.csv` therefore does not
   exist until then, and nothing in this plan reads it. Until it does exist,
   `data/cavallo-history.ts` is the only offline copy of any keyword data (36 of the 86), which is
   why Task 1 Step 8 retains it explicitly rather than letting it be swept up as dead code.
2. **Phase 2 — writing the three `learn/` documents.** Writing, not programming. The dashboard
   renders whatever is in `learn/` and says plainly when it is empty, so this can happen any time
   after Task 6.
3. **Phase 4 — the 47-row review.** A conversation between Mark and Claude, recorded by editing
   `state/pages.csv` and `state/decisions.md`.

## Self-review notes

- **Spec coverage:** every spec section maps to a task except the three items above, which are
  listed as out of scope with their reasons. The spec's `state/keywords.csv` is intentionally
  deferred to Phase 0.
- **Deviation:** app deletion moved from last to first (Task 1), justified above.
- **Type consistency:** `PageRow.destinationUrl` (camelCase in code) maps to `destination_url`
  (snake_case in CSV) in exactly one place, `lib/pages.ts`. `fetchTasks` returns `TaskSnapshot`,
  not `Task[]`, and `scripts/refresh.ts` writes it whole.

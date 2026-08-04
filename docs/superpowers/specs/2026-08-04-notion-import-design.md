# Cavallo SEO — Notion import + work-repo integration (design)

**Date:** 2026-08-04
**Status:** awaiting review
**Completes:** Phase 0 of `docs/superpowers/specs/2026-08-04-project-dashboard-design.md:189`, which has been
blocked on Notion access since it was written.

---

## Problem

Three written sources describe this project, and they disagree with each other. None of them is
wrong on purpose — each was correct when written and then drifted.

| Source | Claims | Verified reality |
|---|---|---|
| `state/where-we-are.md:15` | Build pillars = ⬜ not started | Pillar 1 substantially built; `seo` branch commits dated 2026-08-04 |
| `state/decisions.md:16` | "DSLD is excluded … No page" (2026-06-16) | Reversed 2026-06-27 — DSLD in scope, `dsld in horses` 3,900/mo KD1 |
| `cavallo/CLAUDE.md` and `docs/seo/cavallo-seo-pillar-project.md:75` | "GSC API is blocked for cavallo-inc.com → use Ahrefs" | Search Console works. Ahrefs undercounted by ~14x and is being cancelled |

Two further gaps:

1. **The work queue covers about half the engagement.** The Notion roadmap is six phases,
   June–November. `state/next-actions.md` covers Phases 1–2 and 5–6. **Phase 3 (shop nav funnel,
   ~28h, scheduled for August — now) and Phase 4 (product page overhaul) appear nowhere**, and the
   file's "Not on this list, deliberately" section excludes only Notion task sync. This is an
   omission, not a decision.

2. **The "how to build" standard is invisible from here.** The `seo` branch holds an AI-Citation &
   E-E-A-T build standard (answer-first definition blocks, FAQPage JSON-LD, tables over prose,
   review-ready bylines, CTA below the fold) plus verified build-mechanism corrections — the theme
   does *not* render term descriptions; Pillar 3 became a standalone page. None of it exists in
   `cavallo-seo-project`.

## What this is

An import, a reconciliation, and a scoped symlink. No new system, no new dependencies.

---

## Verified findings that shape the design

These were established by direct comparison, not inference. They are recorded because they are the
reason the import is much smaller than the export.

### The Content Disposition Map must not be imported

`state/pages.csv` and the Notion Content Disposition Map both hold **1,154 rows** with the same
seven fields. The export contains 190 of them. Diffing those 190 against the repo:

| Field | Mismatches |
|---|---|
| `role`, `pillar`, `destination_url`, `source` | **0 of 190** |
| `needs_review`, `evidence` | 7 |

All seven diffs run the same direction: the repo has appended
`GSC: N measured clicks … role contradicted by real data` and set `needs_review=Yes`. The export
predates commit `8de23f2` ("add measured Search Console data; flag 48 contradicted pages").

The Notion map is therefore a **stale mirror**, and importing it would revert review flags — the
exact destruction `AGENTS.md` prohibits. **Rejected outright.**

### Four more CSVs are redundant

| File | Finding |
|---|---|
| `ga4-sessions.csv` | 29 of 30 months identical to `metrics.json`; repo has 32 months |
| `ga4-revenue.csv` | Same. The one differing month (2026-06) is a **mid-month partial** in the export: 11,680 vs 20,078 |
| `organic-visibility-ahrefs.csv` | Repo pull is newer |
| `competitor-overview.csv` | Current snapshot already in `metrics.json` |

**All 30 months of Ahrefs visibility disagree between the two pulls** (2024-01: repo 4,056 vs
export 4,627). Same months, same tool, different numbers — Ahrefs silently revises history. This is
concrete evidence for the measured/estimated separation rule and should be cited in
`state/decisions.md`.

### Two CSVs are genuinely new

| File | Why it matters |
|---|---|
| `keyword-tracking.csv` | 100 keywords with volume, KD, position, prev position, priority, ranking URL. Fills `state/keywords.csv`, which the dashboard spec calls for and which does not exist. The repo currently holds **zero** keyword data |
| `traffic-history.csv` | 13 months × 5 competitors (Jun 2025–Jun 2026). `metrics.json.competitors` is a **single snapshot** with no history. Shows Cavallo 5,711→3,097 while Scoot Boots held 6,509→4,803 — the competitive narrative the whole strategy rests on |

### The work repo

`/Users/markreaction/Local Sites/cavallo/` is **39 GB and not a git repo**. The code repo is
`app/public/wp-content/` (GitHub `themarkroberts/cavallo`), currently checked out on `dev`. A
persistent worktree already exists at `.worktrees/seo` — **152 MB**, clean, pinned to `seo`.

---

## Source-of-truth hierarchy

Declared once in `AGENTS.md` so future sessions stop re-deriving it.

| Domain | Authority | Rule |
|---|---|---|
| **Execution** — what is built | `seo` branch of `themarkroberts/cavallo` | Git history, not memory. If a doc and the branch disagree, the branch wins |
| **Analysis** — pages, traffic, classifications | `cavallo-seo-project/state/` | `pages.csv` + `gsc.json` are canonical |
| **Strategy** — pillars, keywords, competitors | `cavallo-seo-project/reference/` | Imported from Notion; Notion becomes an archive |
| **Tasks** — what to do next operationally | Notion Project Tasks DB | Read-only from here. Mark's decision, 2026-08-04 |

---

## Layout

```
reference/                        NEW — strategy reference, committed, auto-discovered
  00-portal.md                    goals + June 2026 baseline (source-labelled)
  01-roadmap.md                   6 phases, outcomes, team roles
  02-content-strategy.md
  03-competitor-landscape.md
  04-build-standard.md            AI-Citation & E-E-A-T standard + build mechanism (from seo branch)
  05-resources.md
  pillars/pillar-{1,2,3}-*.md
  competitors/{easycare,renegade,scoot,softride}.md

state/
  keywords.csv                    NEW — from keyword-tracking.csv
  competitor-history.csv          NEW — from traffic-history.csv
  where-we-are.md                 REWRITTEN — both progress models, reconciled to today
  next-actions.md                 REWRITTEN — all six phases
  decisions.md                    APPENDED — DSLD reversal, Ahrefs instability, hierarchy
  pages.csv                       UNTOUCHED
  gsc.json / metrics.json         UNTOUCHED

wp-seo -> /Users/markreaction/Local Sites/cavallo/.worktrees/seo    NEW — gitignored
```

Every imported file carries a provenance header: source (Notion page ID or repo path), export date,
and — where the source is known stale — an explicit staleness warning. The raw zip is not kept as a
duplicate tree; git history preserves the originals.

### Why the symlink is safe here

- `tsconfig.json` uses an explicit `include` (`config.ts`, `lib/**`, `scripts/**`, `test/**`), so
  `tsc` never walks it and `npm run check` is unaffected
- macOS `grep -r` does not follow directory symlinks (only `-R` does)
- It targets the 152 MB worktree, not the 39 GB site root
- It is **gitignored**. A committed symlink stores a machine-specific absolute path and breaks in
  any clone, which would defeat the purpose of this repo
- The canonical path is also recorded in `config.ts`, so code can locate the work repo without
  depending on the symlink existing

---

## Import manifest

| Export file | Destination | Verdict |
|---|---|---|
| `00-project-portal.md` | `reference/00-portal.md` | import |
| `01-performance-dashboard.md` | — | reject; superseded by `metrics.json` + `gsc.json` |
| `02-roadmap-phases.md` | `reference/01-roadmap.md` | import |
| `03-content-strategy-pillar-pages.md` | `reference/02-content-strategy.md` | import |
| `04-competitor-landscape.md` | `reference/03-competitor-landscape.md` | import |
| `05-resources-and-documents.md` | `reference/05-resources.md` | import |
| `pillars/*.md` (3) | `reference/pillars/` | import |
| `competitors/*.md` (4) | `reference/competitors/` | import |
| `data/keyword-tracking.csv` | `state/keywords.csv` | import |
| `data/traffic-history.csv` | `state/competitor-history.csv` | import |
| `data/content-disposition-map.csv` | — | **reject — would revert GSC flags** |
| `data/ga4-sessions.csv` | — | reject; repo ahead |
| `data/ga4-revenue.csv` | — | reject; repo ahead |
| `data/organic-visibility-ahrefs.csv` | — | reject; repo pull newer |
| `data/competitor-overview.csv` | — | reject; already in `metrics.json` |
| `data/README.md` | — | reject; completeness notes captured in Risks below |
| `cavallo` seo branch `docs/seo/cavallo-seo-pillar-project.md` | `reference/04-build-standard.md` | import with staleness header |

---

## Reconciliation rules

**`where-we-are.md` carries both progress models and states plainly where they diverge.** The
engagement runs on a calendar (Phase 3 is due this month); execution runs on a 5-step content
pipeline. Neither is wrong; they measure different things. The file must not silently pick one.

**Pillar status is read from git, not from memory.** Pillar 1's status comes from the `seo` branch
log. The current ⬜ is factually wrong and gets corrected.

**`next-actions.md` spans all six phases**, each item tagged with its phase, ordered by what is
actually next rather than by phase number. Phase 3 being due now and unstarted is stated, without
editorialising about schedule risk beyond the facts.

**Baseline figures are source-labelled individually.** The June baseline mixes Ahrefs estimates
(DR, keywords, organic traffic), GA4 (sessions, revenue), and now-available GSC measurements. Each
number carries its origin. The ~3,069 Ahrefs figure and the 4,459 measured July GSC clicks are not
merged, averaged, or presented as alternatives to one another.

---

## Corrections at source

**In scope:**

1. `state/decisions.md` — dated entry reversing the DSLD exclusion, citing the 2026-06-27 audit
2. `state/decisions.md` — dated entry recording the Ahrefs month-over-month instability
3. `AGENTS.md` — the source-of-truth hierarchy above

**Opt-in, requires separate approval (edits the active working branch):**

4. `cavallo/CLAUDE.md` and `docs/seo/cavallo-seo-pillar-project.md:75` — remove the "GSC is blocked
   → use Ahrefs" instruction. This is the highest-value correction in this document, because it is
   a *live instruction* steering the build toward a tool being cancelled. But it means committing to
   `seo`, which is Mark's active branch, so it is deliberately excluded from the default scope.

---

## Code changes

Roughly 15 lines, following a pattern already in the codebase:

- `lib/types.ts` — add `reference: LearnDoc[]` to `ProjectState`
- `lib/state.ts` — `reference: readLearnDocs(join(root, "reference"))`. `readLearnDocs` is already
  directory-generic; no new function needed
- `lib/render.ts` — a fourth tab, "Strategy", rendering `state.reference`
- `config.ts` — record the work-repo path and branch
- `.gitignore` — add `wp-seo`

No new dependencies. No changes to `scripts/refresh.ts`.

---

## Guardrails

- `state/pages.csv` is never regenerated or overwritten. The disposition CSV is rejected
- Nothing writes to Notion
- Curated data must not live in `state/metrics.json` or `state/gsc.json` — `scripts/refresh.ts`
  overwrites both wholesale, so hand-maintained series go in their own files
- Measured and estimated figures stay separately labelled everywhere
- The symlink stays gitignored
- `state/keywords.csv` and `state/competitor-history.csv` land as **committed data only** — no code
  in this scope reads them. If a reader is added later it must throw on a malformed file rather than
  silently yield zero rows, per the fail-loudly rule
- A missing `reference/` directory renders as an empty tab rather than failing the build, matching
  how `learn/` already behaves

## Non-goals

- No client-facing view
- No Notion write path, and no re-import of the task database
- No changes to `site-audit/`
- No attempt to complete the ~964 unexported disposition rows — they are rejected regardless
- No re-litigating pillar strategy; this organises what exists

---

## Risks

- **The pillar-project doc is dated 2026-06-27.** DSLD is one confirmed reversal; there may be
  others. It is imported with a staleness header and treated as evidence, not gospel. Where it
  conflicts with the `seo` branch, the branch wins.
- **Nine keyword rows were never exported** (100 of 109) because Notion's query quota was hit.
  Recoverable later; a note goes in `state/keywords.csv`'s header.
- **Phase 3 is due now and unplanned.** Surfacing it is the point, but it will make the queue look
  considerably worse than it did. That is accurate, not alarming.
- **The `seo` branch and `main` have diverged** (73 behind, 47 ahead). This design reads the branch
  and does not attempt to reconcile the divergence.
- **The symlink is machine-local.** Anyone cloning this repo gets a broken path unless they
  recreate it. Mitigated by recording the path in `config.ts` and documenting it in `AGENTS.md`.

## Success criteria

1. `dashboard.html` shows all six phases, with Pillar 1's real status, and the next action is
   correct as of today.
2. Every imported file states where it came from and when.
3. `state/pages.csv` is byte-identical to its pre-import state.
4. `npm run check` passes.
5. No figure in `reference/` or `state/` is presented without a measured-or-estimated label.
6. `git log` explains why DSLD came back into scope.

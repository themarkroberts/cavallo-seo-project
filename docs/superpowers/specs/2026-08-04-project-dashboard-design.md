# Cavallo SEO — Project Dashboard (design)

**Date:** 2026-08-04
**Status:** awaiting review
**Supersedes:** the "deliverables go to Notion, not code" direction in `PILLAR-BUILD-PLAN.md:4`

---

## Problem

The Cavallo SEO project has real substance — 1,154 audited pages, a classification for every
URL, three pillar strategies, four locked architecture decisions — and Mark cannot hold any of
it in his head or see it in one place.

Two prior attempts each solved half the problem and were abandoned:

1. **A client-facing Next.js dashboard** (git history, commits #1–#8). Built for Cavallo to
   read. Deprioritized.
2. **Notion as the deliverable surface.** Strategy, keyword map, and the Content Disposition
   Map were pushed into the Cavallo workspace. **The Cavallo team does not use it**, so the
   push was wasted effort and the data is going stale.

Neither was built for the person who actually needs it: Mark, who has to direct this project
and cannot currently answer "where are we, what do I do next, and why is that the right move?"

## What this is

A folder of plain text files holding everything known about the project, plus a script that
renders them into a single self-contained HTML page opened from disk.

**The files are the product. The page is a view onto them.**

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Audience | Mark only, internal | Cavallo isn't reading it. No branding, no client polish, no diplomatic framing. Content can be blunt. |
| Gap to close | Visibility + comprehension + execution | All three, delivered as three views over one state model rather than three systems. |
| Notion content | Extract before disconnecting | Playbooks, the 86-keyword map, and any review decisions exist only in Notion. Disconnecting first strands them. |
| Write path | Conversational — Mark tells Claude, Claude edits files | No backend, no auth, no write API. Every change lands in git with a date and reason. |
| Notion boundary | Read-only, task database only | Notion is genuinely good at task management; files are bad at it. Nothing is ever written back. |
| The 47-row review | Conversational with Claude | It's a one-time pass, and explaining each classification while Mark decides is the single best teaching opportunity in the project. |
| Delivery | Static generated HTML, opened from disk | Removes hosting, scheduled jobs, stored secrets in two places, and a discontinued storage product. |

### Why not the existing Next.js app

- Its persistence layer is `@vercel/kv` (`src/lib/kv.ts:6`). **Vercel KV is discontinued.** A
  load-bearing part would have to be replaced before anything ran.
- It fails silently by design — 23 swallow-the-error paths across `src/lib/`, 8 in `kv.ts`
  alone. With KV gone, the cron falls back to `seedSnapshot`, returns `{ok: true}`, and the
  page renders June data labeled as current. For a tool whose job is reporting project truth,
  silently serving stale data is the worst available failure mode.
- It overwrites `snapshot:cavallo` on every write, so it cannot answer "what changed since
  last month" — the exact question this project needs answered.
- Its freshness machinery (nightly cron, ISR revalidation, hosted deploy) serves unannounced
  remote readers. There is one reader, and he arrives in a session with Claude.

## Non-goals

- No client-facing view. If Cavallo ever needs a link, that is a separate project.
- No live/always-fresh data. Numbers refresh when asked for.
- No write UI. No clickable checkboxes outside Notion's task database.
- No multi-client support. The `clients` registry scaffold is removed.
- No re-authoring of the audit pipeline. `site-audit/` stays as-is.

## Architecture

### Runtime

Node 22 (v22.22.2 confirmed local) runs TypeScript directly with no build step, no bundler, no
transpiler. Scripts are `.ts` files executed with `node script.ts`.

`site-audit/` remains Python and is not touched.

### Layout

```
state/                    canonical project state — committed
  where-we-are.md         current step, what's done, what's blocked
  decisions.md            every decision, its reasoning, its date
  next-actions.md         ordered queue with rationale and unblocks
  pages.csv               1,154 pages: url, pillar, role, destination_url, evidence, source, needs_review
                          (same schema as site-audit/content_disposition_map.csv; needs_review is
                          cleared as each row is decided, with the reasoning going to decisions.md)
  keywords.csv            the full keyword map
  metrics.json            Ahrefs + GA4 figures, snapshotted on each refresh
  tasks.json              snapshot of the Notion task database

learn/                    teaching material — committed
  why-301-not-noindex.md
  why-552-pages-get-deleted.md
  why-these-three-pillars.md

lib/                      kept fetchers, moved from src/lib
  ahrefs.ts
  ga4.ts
  google-auth.ts
  notion-tasks.ts         read-only task fetch, derived from src/lib/notion.ts

scripts/
  refresh.ts              fetch Ahrefs + GA4 + Notion tasks -> state/metrics.json, state/tasks.json
  build.ts                state/ + learn/ -> dashboard.html

dashboard.html            generated — gitignored
```

`dashboard.html` is **gitignored deliberately.** Committing a large regenerated HTML file
would flood the history with noise, and that history is the mechanism we rely on for progress
tracking. `metrics.json` and `tasks.json` **are** committed, because their diffs are what make
progress visible over time.

### The three views

One page, three tabs, matching the three gaps:

- **Where we are** — current step of 5, completed steps, blocked items with the reason, current
  numbers with their source labeled.
- **What's next** — the ordered queue. Top item, why it is top, what completing it unblocks.
- **Why** — the `learn/` documents, plus a searchable, filterable table of all 1,154 pages so
  any individual classification can be checked against its evidence.

### Data flow

```
Notion task DB ────┐
Ahrefs ────────────┼──> scripts/refresh.ts ──> state/*.json
Google Analytics ──┘

state/ + learn/ ──> scripts/build.ts ──> dashboard.html ──> opened from disk
```

Both scripts are run on request. Nothing is scheduled.

### Write paths

| What | Changed where | By whom |
|---|---|---|
| Tasks: completion, due dates, new work | Notion task database, directly | Mark |
| Page classifications, decisions, notes | `state/*` | Claude, on Mark's instruction |
| Numbers | `state/metrics.json` | `scripts/refresh.ts` |

### Notion boundary

Read-only, one database: `ff3ec7b0-97d8-42a0-b323-5eb8badc3a1e` (Project Tasks).

`src/lib/notion-sync.ts` is deleted entirely — the keywords, visibility, sessions, revenue, and
competitor pushes all stop. The five corresponding Notion databases become orphaned and should
be deleted by Mark so they are not mistaken for live data.

`NOTION_TOKEN` becomes **permanently required**, not optional, because the refresh script reads
tasks on every run.

## Consequence: the classifier is retired as a generator

`site-audit/build_disposition_map.py` is currently documented as "deterministic, re-runnable."
Once Mark's review decisions live in `state/pages.csv`, **re-running it would overwrite human
judgment with heuristics.**

After migration the script is retained for reference only. `state/pages.csv` becomes the
canonical record and is edited surgically, never regenerated wholesale. This must be stated in
the file's header comment so a future session cannot make that mistake.

## Removals

Deleted: `src/app/`, `src/components/`, `src/middleware.ts`, `src/lib/kv.ts`,
`src/lib/notion-sync.ts`, `src/lib/gsc.ts`, `src/lib/snapshot.ts`, `src/lib/clients.ts`,
`src/lib/trend.ts`, `vercel.json`, and the `next` / `react` / `react-dom` / `recharts` /
`@vercel/kv` / `eslint-config-next` / `tailwindcss` dependencies. Roughly 3,000 lines.

Kept and relocated: `ahrefs.ts`, `ga4.ts`, `google-auth.ts`, and the task-reading half of
`notion.ts`.

From `types.ts`, these are retained as-is: `MonthPoint`, `KeywordDetail`, `PhaseTask`,
`PhaseDetail`, `PillarPage`. `ClientSnapshot` is **replaced** by a client-agnostic
`ProjectState` type — it currently encodes the multi-client concept being removed, and carries
`documents` / `projectContext` fields whose contents move to `state/where-we-are.md` where they
are readable without a program.

`CRON_SECRET` is no longer needed. Required credentials reduce to `NOTION_TOKEN`,
`AHREFS_API_TOKEN`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN` — local
only, in `.env.local`.

Everything removed remains recoverable from git history.

## Phases

| Phase | Work | Blocked by |
|---|---|---|
| 0 | Authenticate `notion-cavallo`; extract playbooks, keyword map, review decisions, task statuses into `state/` and `learn/`; Mark confirms nothing missing | Mark's one-time browser login |
| 1 | `state/` files, `scripts/refresh.ts`, `scripts/build.ts`, dashboard with "Where we are" + "What's next" | Phase 0 |
| 2 | Write the three `learn/` documents | nothing |
| 3 | Delete the Next.js app and Notion write-back; trim dependencies | Phase 0 confirmed |
| 4 | Conversational review of the 47 flagged rows | Phase 1 |

## Risks

- **Phase 2 gets shortchanged.** It is writing, not programming, and it is the thing Mark
  actually asked for. Mitigation: three documents scoped to the highest-money decisions, written
  before Phase 3 cleanup, expanded on demand rather than guessed at upfront.
- **Traffic figures are Ahrefs estimates, not real clicks.** GSC is permission-blocked for
  cavallo-inc.com (`PILLAR-BUILD-PLAN.md:89`), and only ~72 of 1,154 pages register any organic
  traffic. The dashboard must label these as estimates so they are not over-trusted.
- **Credentials are not currently present.** No `.env.local` exists. Phase 1 cannot complete
  until Ahrefs and Google credentials are supplied.
- **99 MERGE+301 destinations point at pages that do not exist yet.** The queue must never
  surface those merges as actionable before their destination is published.

## Success criteria

1. `dashboard.html` opens offline and shows the current step, the next action with its
   reasoning, and all 1,154 pages searchable with evidence.
2. Every project decision carries a date and a reason, and `git log` can answer "what changed,
   and when?"
3. Nothing writes to Notion. Tasks read cleanly from the one remaining database.
4. Three `learn/` documents exist and explain the reasoning behind the most consequential
   decisions.
5. Traffic figures are visibly labeled as estimates.

# Next actions

Ordered. Top item first.

## 1. Review the 95 flagged rows

**Why first:** every later step depends on the map being correct. Step 4 mass-noindexes 235 pages
and Step 5 runs 301s — both hard to walk back.

**How:** conversationally with Claude, in batches, starting with the highest click counts. Claude
presents each page with its measured clicks, impressions and the reasoning behind its
classification; Mark decides; the call and its reasoning are recorded here and in `decisions.md`.

**Start with these** — measured clicks, 12 months, all currently marked for removal:

| Clicks | Role | URL |
|---|---|---|
| 245 | PRUNE | `/natural-remedies-for-your-horse/` |
| 185 | PRUNE | `/equine-ting-points/` |
| 102 | PRUNE | `/we-are-all-flesh/` |
| 79 | PRUNE | `/ouch-lose-the-bruise/` |
| 79 | PRUNE | `/trek-pro-launch/` |
| 45 | PRUNE | `/digital-pulse/` |
| 41 | PRUNE | `/barefoot-booted-dressage-movement-reaches-olympic-level/` |
| 38 | NOINDEX | `/category/miniature-horses-vse/` |

**Two classifier caveats to watch for:** "boots" appears on nearly every post because Cavallo is a
boot company, so some Pillar 1 tags are loose. And merges pointing at `(NEW)` destinations cannot
run until those pages exist.

**Also worth doing during the review:** the 48 GSC-flagged rows are only those at ≥10 clicks. 284
rows have ≥1 click. Sort the dashboard's Clicks column to go lower whenever you want — no re-run
needed.

## 2. Noindex the tag and auto archives (Mark, in WordPress)

**Why:** one Yoast taxonomy setting clears 235 rows. Best result-to-effort ratio in the project.
Risks ~222 clicks/year, which is noise.

**Not blocked.** An earlier claim that this would destroy traffic was wrong.

## 3. Write the three `learn/` documents

**Why it matters:** this was the original ask — to be educated on the strategy, not just shown a
dashboard. The "Why" tab currently displays a warning saying they do not exist.

**Do it after the review**, not before: walking through 95 real decisions reveals what actually
needs explaining, rather than guessing.

Proposed three, covering the highest-money decisions:
- `why-301-not-noindex.md` — redirects pass ranking signal; noindex strands it
- `why-552-pages-get-deleted.md` — and why that is only 4% of traffic
- `why-these-three-pillars.md` — the cluster logic and cannibalization

## 4. Keyword-gap research

**Blocked on a decision, not on work.** See `docs/HANDOFF-2026-08-04.md` — the Ahrefs
subscription is being cancelled, Semrush is verified working and available (units are metered, so
what to spend them on is still undecided), and Google Keyword Planner is a verified free alternative.

## 5. Build Pillar 1 — Hoof Boot Guide

**Why before 2 and 3:** it enriches `/product-category/hoof-boot/`, already the strongest asset at
4,230 measured clicks/year. Lowest risk, because the page exists and ranks.

**Unblocks:** 24 merges pointing at it.

**Rule:** publish the pillar first, confirm it covers the topic, *then* run the 301s.

## Not on this list, deliberately

**Notion task sync.** Blocked on Mark being unable to create an integration token in the client's
workspace. The dashboard works fine without it. Lowest priority.

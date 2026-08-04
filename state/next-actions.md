# Next actions

Ordered by what is actually next, not by phase number. Each item is tagged with the engagement phase
it belongs to (see `state/where-we-are.md` for how the six-phase calendar relates to the five-step
content pipeline).

**The engagement is roughly two phases behind the calendar, and Phase 3 is due this month.** Items 6
and 7 below are the shop-restructure half of the project. They were absent from this file until
2026-08-04 — not deliberately deferred, simply never tracked here.

## 1. Review the 96 flagged rows  ·  *Phase 1*

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

**Start here instead — the measuring pair.** Two live pages both rank for measuring intent and
together carry ~291,000 impressions, roughly 10% of site traffic:

| Clicks | Impr. | CTR | URL |
|---|---|---|---|
| 2,839 | 207,430 | 1.4% | `/things-to-know/how-to-measure/` — **missing from the June audit** |
| 2,269 | 83,844 | 2.7% | `/how-to-measure/` — audited, 502 words |

The open question is whether they serve different search intent or compete. The differing CTR
suggests different intent, but `state/gsc.json` holds no query-level data, so nothing settles it yet.
Both are `OPTIMIZE`, so nothing destructive is queued. Mark is reviewing the pages directly.

**Two classifier caveats to watch for:** "boots" appears on nearly every post because Cavallo is a
boot company, so some Pillar 1 tags are loose. And merges pointing at `(NEW)` destinations cannot
run until those pages exist.

**Also worth doing during the review:** the 48 GSC-flagged rows are only those at ≥10 clicks. 284
rows have ≥1 click. Sort the dashboard's Clicks column to go lower whenever you want — no re-run
needed.

## 2. Noindex the tag and auto archives (Mark, in WordPress)  ·  *Phase 1*

**Why:** one Yoast taxonomy setting clears 235 rows. Best result-to-effort ratio in the project.
Risks ~222 clicks/year, which is noise.

**Not blocked.** An earlier claim that this would destroy traffic was wrong.

## 3. Write the three `learn/` documents  ·  *not on the roadmap — internal*

**Why it matters:** this was the original ask — to be educated on the strategy, not just shown a
dashboard. The "Why" tab currently displays a warning saying they do not exist.

**Do it after the review**, not before: walking through 95 real decisions reveals what actually
needs explaining, rather than guessing.

Proposed three, covering the highest-money decisions:
- `why-301-not-noindex.md` — redirects pass ranking signal; noindex strands it
- `why-552-pages-get-deleted.md` — and why that is only 4% of traffic
- `why-these-three-pillars.md` — the cluster logic and cannibalization

## 4. Keyword-gap research  ·  *Phase 1*

**Blocked on a decision, not on work.** See `docs/HANDOFF-2026-08-04.md` — the Ahrefs
subscription is being cancelled, Semrush is verified working and available (units are metered, so
what to spend them on is still undecided), and Google Keyword Planner is a verified free alternative.

## 5. Finish Pillar 1 — Hoof Boot Guide  ·  *Phase 1, overdue*

**Status corrected 2026-08-04: this is not a fresh start.** Nine hub sections already exist in code
on the `seo` branch — `intro, types, choose, uses, sizing, accessories, laminitis, credibility, faq`.
What is unverified is whether the ACF copy is written and live, since that lives in the WordPress
database rather than the repo. **First action is to check the live page, not to build.**

**Why before Pillars 2 and 3:** it enriches `/product-category/hoof-boot/`, already the strongest
asset at 4,230 measured clicks/year. Lowest risk, because the page exists and ranks.

⚠️ **Check the sizing section before it publishes.** `hub/sizing.php` renders a teaser plus one CTA
(default label "How to Measure Your Horse's Hoof"), which is the right pattern — but its `cta_url` is
a DB value. Two live measuring pages exist, together carrying ~291,000 impressions. Point the CTA at
whichever wins item 1's review.

**Unblocks:** 24 merges pointing at it.

**Rule:** publish the pillar first, confirm it covers the topic, *then* run the 301s.

## 6. Shop nav funnel — 5 category landing pages  ·  *Phase 3, DUE THIS MONTH*

**Never tracked in this repo before 2026-08-04.** The roadmap calls it the biggest single workstream
at ~28 hours estimated, and the change most visible to customers: rebuild shop navigation around how
buyers actually think — by animal type and by condition, not by product name. Five category landing
pages go live with full SEO; the old shop page redirects into the new structure.

**Gated on Carole locking the category scheme** (`reference/04-build-standard.md`), which was Phase
2 work that is not evidenced as done. That gate is the first thing to confirm.

**Team's role per the roadmap:** finalise category descriptions, confirm product-to-category mapping,
test the funnel, plan the newsletter feature, identify boot-to-accessory pairings.

## 7. Product page overhaul  ·  *Phase 4*

Cross-sell recommendations currently surface competing boots, which confuses buyers; they should
surface companion accessories. Functional copy needs correcting — soles are identical across regular
sizes and the pages do not say so. The acute-laminitis boot needs differentiating on its patented
floating-toe design.

**Related and unresolved:** 96 of 178 product URLs that earn Search Console traffic have no role in
`state/pages.csv`, including the three differentiators the strategy leans on — the LEB long-ear
donkey boot (293 clicks), the Big Foot draft boot (285) and Cute Little Boots minis (179). Phase 4
cannot be scoped properly until those are classified.

## Not on this list, deliberately

**Notion task sync.** Blocked on Mark being unable to create an integration token in the client's
workspace. The dashboard works fine without it. Lowest priority.

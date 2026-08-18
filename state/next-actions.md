# Next actions

Ordered by what is actually next, not by phase number. Each item is tagged with the engagement phase
it belongs to (see `state/where-we-are.md` for how the six-phase calendar relates to the five-step
content pipeline).

**The engagement is roughly two phases behind the calendar, and Phase 3 is due this month.** Items 7
and 8 below are the shop-restructure half of the project. They were absent from this file until
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

**Query-level data can now settle questions like this.** Search Console's `query` dimension was
pulled successfully on 2026-08-11 for the laminitis cluster (see item 2). `lib/gsc.ts` has no query
dimension yet, so it is a one-off script for now — but the capability is proven, and this pair is the
obvious next use.

**Two classifier caveats to watch for:** "boots" appears on nearly every post because Cavallo is a
boot company, so some Pillar 1 tags are loose. And merges pointing at `(NEW)` destinations cannot
run until those pages exist.

**Also worth doing during the review:** the 48 GSC-flagged rows are only those at ≥10 clicks. 284
rows have ≥1 click. Sort the dashboard's Clicks column to go lower whenever you want — no re-run
needed.

## 2. Build the commercial laminitis page, then split the laminitis cluster in two  ·  *Phase 2, overdue*

**New 2026-08-11.** Query-level Search Console data showed the laminitis cluster is cannibalizing
itself commercially, which no page-level view could reveal. Full evidence:
`docs/laminitis-task-audit-2026-08-11.md`.

**The finding.** Three of Cavallo's own URLs rank positions 2–15 on the *same* commercial boot
queries, and the "educational" canonical is the worst-performing of them:

| Page | 12mo clicks | Attributable | Commercial | Informational |
|---|---|---|---|---|
| `/your-cavallo-laminitis-healing-plan/` | 597 | 112 | **105 (94%)** | **7** |
| `/faq/cavallo-hoof-boots-for-laminitis/` | 484 | 154 | 143 | 11 |
| `/cavallo-laminitis-guide/hoof-rehab-page/` — **no role in `pages.csv`** | 202 | 107 | **107 (100%)** | 0 |

Google anonymises long-tail queries, so only ~19–30% of clicks are attributable; the split within
that share is unambiguous. Nobody owns the educational cluster — 7 clicks across 3,290 impressions.

**The model: two pages, one per intent.**

- **Educational** — `/your-cavallo-laminitis-healing-plan/`. **Already built** on the `seo` branch,
  live on staging only: 8,841 words, 34 headings, Article + FAQPage JSON-LD, a "Laminitis vs.
  Founder" section. Not on production.
- **Commercial** — **needs building.** Recommended slug `/hoof-boots-for-laminitis/`, verified free
  on both production and staging.

**Why a new page rather than rebuilding the FAQ page in place:** `/faq/...` is a custom post type, so
turning it into a product-grid landing page fights its template. A new page also gives Pillar 1's
`hub/laminitis.php` CTA a proper commercial destination — it currently points at the FAQ URL.

⚠️ **The non-negotiable condition: 301 the FAQ page into the new page once the new page is live.**
Building the commercial page and leaving `/faq/cavallo-hoof-boots-for-laminitis/` up alongside it
creates a *fourth* competitor and makes the problem worse than it is today. Expect some temporary
ranking fluctuation even when the migration is done correctly.

**Lower-risk fallback** if a migration is unwanted: keep the FAQ page as the commercial canonical and
expand it in place, accepting the weak `/faq/` path. Zero ranking risk, smaller ceiling.

### Sequence

1. **Build `/hoof-boots-for-laminitis/` on `seo`** — product grid, buying-guide copy, and the
   EquiFloat acute-laminitis boot differentiated on its patented floating-toe design (this absorbs
   part of item 8). Repoint the `hub/laminitis.php` CTA, which is an ACF database value.
2. **Cross-link the two pages.** The guide body currently has **zero internal links** — all 13 hrefs
   are external citations. The guide's "Hoof Support During Recovery" section should link to the
   commercial page, and the commercial page back to the guide. Without this the two-page split is
   two silos, and Google cannot read the intent separation.
3. **Settle the laminitis rows during item 1's review** — these are Mark's calls, not the
   classifier's: `/cavallo-laminitis-guide/hoof-rehab-page/` (202 clicks, no role, parent 404s) ·
   the 2023 laminitis-guide PDF (12 clicks, 4,087 impressions — competes with the new guide) ·
   `/cavallorevolution-promo/…for-laminitis/` (30) · `/faq/laminitis-and-cavallo-hoof-boots/` (921w
   near-duplicate) · `/laminitis-plan-series-part-1/` and `-part-2/` (OPTIMIZE while `-part-3/`
   merges — a classifier artifact) · and re-roling `/faq/cavallo-hoof-boots-for-laminitis/` itself
   from KEEP-SPOKE to MERGE+301.
4. **Publish both pages to production.** Two dependencies: Pillar 2 `/horse-hoof-care/` **404s on
   production** and the guide's breadcrumb points at it, so Pillar 2 publishes first; and Pillar 2
   still renders 3 "coming soon" links, which is what Mark's 2026-08-05 call blocks publishing on.
   Releasing to production means `seo` merging outward — **outside this project's write boundary**,
   so that step belongs to Mark and the site team.
5. **Then run the 301s** — 58 mapped rows into the guide; FAQ page + attachment + promo + PDF into
   the commercial page. Never before step 4: redirecting into a destination that has not published
   throws the ranking signal away instead of passing it on.

**Ceiling.** Running only the 301s already in the map takes the guide from 33.4% to 53.2% of the
1,787-click laminitis/founder pool. The remaining 47% is the commercial cluster plus 295 clicks that
have no role at all — which is what steps 1 and 3 above address.

**Also fix:** `/faq/cavallo-hoof-boots-for-laminitis/` carries evidence "tr=27" in `pages.csv`
against **484 measured clicks** — another Ahrefs-era undercount, ~18x. It is also filed under
Pillar 2 despite being a purely commercial page.

## 3. Noindex the tag and auto archives (Mark, in WordPress)  ·  *Phase 1*

**Why:** one Yoast taxonomy setting clears 235 rows. Best result-to-effort ratio in the project.
Risks ~222 clicks/year, which is noise.

**Not blocked.** An earlier claim that this would destroy traffic was wrong.

## 4. Write the three `learn/` documents  ·  *not on the roadmap — internal*

**Why it matters:** this was the original ask — to be educated on the strategy, not just shown a
dashboard. The "Why" tab currently displays a warning saying they do not exist.

**Do it after the review**, not before: walking through 95 real decisions reveals what actually
needs explaining, rather than guessing.

Proposed three, covering the highest-money decisions:
- `why-301-not-noindex.md` — redirects pass ranking signal; noindex strands it
- `why-552-pages-get-deleted.md` — and why that is only 4% of traffic
- `why-these-three-pillars.md` — the cluster logic and cannibalization

A fourth now suggests itself from item 2: **`why-two-laminitis-pages.md`** — one page cannot rank for
both "what is laminitis" and "best boots for laminitis", and the query data proves it.

## 5. Keyword-gap research  ·  *Phase 1*

**Blocked on a decision, not on work.** See `docs/HANDOFF-2026-08-04.md` — the Ahrefs
subscription is being cancelled, Semrush is verified working and available (units are metered, so
what to spend them on is still undecided), and Google Keyword Planner is a verified free alternative.

## 6. Finish Pillar 1 — Hoof Boot Guide  ·  *Phase 1, overdue*

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

⚠️ **The `hub/laminitis.php` CTA has the same problem** — its `cta_url` currently points at
`/faq/cavallo-hoof-boots-for-laminitis/`. Repoint it when item 2 builds the commercial page.

**Unblocks:** 24 merges pointing at it.

**Rule:** publish the pillar first, confirm it covers the topic, *then* run the 301s.

## 7. Shop nav funnel — 5 category landing pages  ·  *Phase 3, DUE THIS MONTH*

**Never tracked in this repo before 2026-08-04.** The roadmap calls it the biggest single workstream
at ~28 hours estimated, and the change most visible to customers: rebuild shop navigation around how
buyers actually think — by animal type and by condition, not by product name. Five category landing
pages go live with full SEO; the old shop page redirects into the new structure.

**Gated on Carole locking the category scheme** (`reference/04-build-standard.md`), which was Phase
2 work that is not evidenced as done. That gate is the first thing to confirm.

**Team's role per the roadmap:** finalise category descriptions, confirm product-to-category mapping,
test the funnel, plan the newsletter feature, identify boot-to-accessory pairings.

**Note:** "by condition" is exactly the shape item 2 builds. `/hoof-boots-for-laminitis/` is the first
condition landing page — worth confirming it fits the scheme Carole locks, so it is not rebuilt twice.

## 8. Product page overhaul  ·  *Phase 4*

Cross-sell recommendations currently surface competing boots, which confuses buyers; they should
surface companion accessories. Functional copy needs correcting — soles are identical across regular
sizes and the pages do not say so. The acute-laminitis boot needs differentiating on its patented
floating-toe design — **item 2 step 1 does part of this**, since the commercial laminitis page is
where that differentiation earns its keep.

**Related and unresolved:** 96 of 178 product URLs that earn Search Console traffic have no role in
`state/pages.csv`, including the three differentiators the strategy leans on — the LEB long-ear
donkey boot (293 clicks), the Big Foot draft boot (285) and Cute Little Boots minis (179). Phase 4
cannot be scoped properly until those are classified.

## Not on this list, deliberately

**Notion task sync.** Blocked on Mark being unable to create an integration token in the client's
workspace. The dashboard works fine without it. Lowest priority.

**Closing the Notion task "Combine our laminitis articles into one complete guide."** It is not
redundant. Authoring the guide moved zero clicks; the consolidation in item 2 is what the task is
actually for. See `docs/laminitis-task-audit-2026-08-11.md`.

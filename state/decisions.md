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

## 2026-08-04 — 48 pages flagged from Search Console data

Search Console turned out to be readable after all (it was assumed blocked). Measured clicks
contradict the role on 48 pages marked PRUNE or NOINDEX, all at >=10 clicks over
2025-08-04..2026-08-03. They are flagged for review; no role was changed.

Largest disagreements:

- 238 clicks — `/natural-remedies-for-your-horse/` marked PRUNE
- 186 clicks — `/equine-ting-points/` marked PRUNE
- 102 clicks — `/we-are-all-flesh/` marked PRUNE
- 78 clicks — `/ouch-lose-the-bruise/` marked PRUNE
- 77 clicks — `/trek-pro-launch/` marked PRUNE
- 45 clicks — `/digital-pulse/` marked PRUNE
- 42 clicks — `/barefoot-booted-dressage-movement-reaches-olympic-level/` marked PRUNE
- 40 clicks — `/cavallo-hoof-boots-for-healing/` marked PRUNE
- 38 clicks — `/category/miniature-horses-vse/` marked NOINDEX
- 38 clicks — `/do-cavallo-hoof-boots-stay-on/` marked PRUNE

The wider picture: the classifier was directionally right. All 787 PRUNE+NOINDEX rows together
hold about 4% of site clicks. This is a thin tail of wrong calls, not a systemic failure.

## 2026-08-04 — Search Console is the source of truth for our own traffic

GSC was believed permission-blocked for cavallo-inc.com. It is not, and never was — the Google
account in `../mrc-marketing/.env` holds siteOwner. Measured: 52,078 clicks across 4,629 pages
over 12 months, against an Ahrefs estimate of ~72 pages with traffic. A ~14x undercount, and the
entire disposition map was scored on it.

Measured Search Console data and estimated Ahrefs data are now kept in separate files and
separately labelled everywhere they appear. They are never merged into one figure — conflating
them is how the error stayed invisible.

## 2026-08-04 — 48 pages flagged, no roles changed

48 pages marked PRUNE or NOINDEX earn 10+ measured clicks a year. They are flagged for review with
their click counts as evidence. **No role was changed by a script.** A heuristic silently
overriding human judgement is what retiring the classifier was meant to prevent.

Threshold is 10 clicks/12mo. 284 rows have 1+ clicks, but 1-9 clicks a year is noise and 284 is
more review than gets done. Every row carries its real click count in the dashboard, so going
lower needs no re-run.

## 2026-08-04 — Step 4 is not blocked (correcting an earlier claim)

An earlier analysis in this session said Step 4 would destroy real traffic. That was overstated.
All 787 PRUNE+NOINDEX rows hold about 4% of site clicks; mass-noindexing the 235 archives risks
~222 clicks a year across 4 pages above 10 clicks. The classifier was directionally right.

## 2026-08-04 — Ahrefs is being cancelled for cost

Own traffic moves to Search Console (free, already working). Keyword volumes and ideas can move to
Google Keyword Planner via the Ads API (free, credentials verified working, not yet built).
Competitor organic traffic has no free replacement and will be lost — it is also the least
load-bearing figure in the dashboard.

Semrush was initially ruled out on the belief that its API needs a Business plan plus purchased
credits. That belief was wrong — see the 2026-08-04 entry below.

## 2026-08-04 — Semrush API works and is already paid for; available but not yet in use

The earlier reading was wrong twice over. The `semrtkn-pat-…` v4 PAT in `.env.local` is valid, the
current plan already carries 50,000 API units/month with MCP access included, and Business is only
needed to buy *more* units. Verified with a live `domain_rank` call for `cavallo-inc.com` through
`https://mcp.semrush.com/v2/mcp`. There is also no separate v3 key: Semrush consolidated key
management, so the hypothesis about *Subscription info → API units* holding a different key is dead.

**Status: available, not in use.** Mark's words: "let's just stop using it right now, we don't need
to use it right now." That is a *not yet*, not a rejection — no code path calls it and no use case has
been chosen. Choosing one is an open item.

Worth weighing when that decision comes: units are capped at 50,000/month and cannot be topped up on
this plan, billing is per line of data, and the thing Semrush uniquely offers over the free stack
(competitor organic traffic) is also the least load-bearing figure in the dashboard.

The MCP server is registered in `~/.claude.json` at project scope **with an `Authorization: Apikey`
header**, so it is authenticated and ready on demand. Two caveats: any session in this project can
spend units, and this puts a second plaintext copy of the key outside `.env.local`, which cuts against
the "credentials are shared, not duplicated" rule in `AGENTS.md`. The key was also echoed into a
session transcript on 2026-08-04, so rotating it is advisable.

Also noted: Semrush's estimate for our own traffic runs 2.4x above MEASURED Search Console clicks
(10,764 vs 4,459, July 2026). Better than Ahrefs' ~14x, but it stays in its own labelled lane.

## 2026-08-04 — DSLD is back IN scope, reversing the 2026-06-16 exclusion

The entry above dated 2026-06-16 says DSLD is excluded as "a connective-tissue disease, not
hoof-seated." The 2026-06-27 audit reversed that: **DSLD is IN scope** as a net-new spoke targeting
`dsld in horses` (3,900/mo, KD 1), framed in the comfort/protection lane with the
cosmetic-vs-clinical guardrail made explicit. Source: `reference/04-build-standard.md`, decisions
log. The Notion roadmap's Phase 5 also lists DSLD among the condition spokes, which corroborates it.

This repo carried the superseded version for five weeks. `state/pages.csv` contains no DSLD rows, so
nothing was misclassified — but the spoke was absent from all planning here.

## 2026-08-04 — Ahrefs revises its own history, which is why estimates stay quarantined

Comparing the Ahrefs organic-visibility series in `state/metrics.json` against the copy exported from
Notion: **all 30 overlapping months disagree.** 2024-01 reads 4,056 in one pull and 4,627 in the
other. Same month, same tool, two pulls — different numbers.

The rule that measured and estimated figures never merge already existed. This is the concrete
evidence for it: an Ahrefs figure is not even stable for a month that has already closed, so it
cannot be compared against a Search Console count, and two Ahrefs pulls cannot be compared against
each other either. GA4 by contrast matched on 29 of 30 months; the single mismatch was a mid-month
partial in the export.

## 2026-08-04 — Source-of-truth hierarchy, because three sources contradicted each other

The Notion export landed alongside two other written records, and they disagreed on the pillar build
status, on whether DSLD was in scope, and on whether Search Console works. Rather than pick one
system, each domain now has a declared owner:

| Domain | Authority |
|---|---|
| **Execution** — what is actually built | the `seo` branch of `themarkroberts/cavallo`. Git history, not memory. If a doc disagrees with the branch, the branch wins |
| **Analysis** — pages, traffic, classifications | `state/` in this repo. `pages.csv` and `gsc.json` are canonical |
| **Strategy** — pillars, keywords, competitors | `reference/` in this repo. Notion is now an archive, not a source |
| **Tasks** — operational next steps | the Notion Project Tasks database, read-only from here |

## 2026-08-04 — Notion export imported; five of seven databases deliberately rejected

12 of 21 exported files were imported into `reference/`, plus `state/keywords.csv` (100 keywords) and
`state/competitor-history.csv` (13 months x 5 competitors — the repo previously held only a single
competitor snapshot).

Rejected, with reasons: the **Content Disposition Map** export is a stale mirror of
`state/pages.csv` — both hold 1,154 rows, the export has 190 of them, and diffing showed zero
mismatches on role/pillar/destination but 7 rows where this repo has appended Search Console
evidence the export lacks. Importing it would have reverted review flags. The **GA4 sessions**,
**GA4 revenue**, **Ahrefs visibility** and **competitor overview** exports are all superseded by
`state/metrics.json`, which holds 32 months against the export's 30.

Two known gaps: 9 of 109 keyword rows were never exported because Notion's query quota was hit, and
the Project Tasks database was excluded on purpose — tasks stay in Notion.

## 2026-08-05 — SEO branch only: this project never touches the site's `dev` or `main`

Mark's standing instruction. All WordPress work happens on the `seo` branch and nowhere else.

The mechanism is the **pinned worktree** at `.worktrees/seo`, which is checked out on `seo` and cannot
alter another branch. `app/public/wp-content` is off limits for both edits and git commands: during a
single session it was observed on `dev` and then on `main`, so a commit there could silently land SEO
work on the wrong branch. To read another branch, use `git -C <worktree> show <branch>:<path>`.

Verified at the time of writing: the only commit this project has made to the site repo is `600c1d7c`
(docs), and `git branch --contains` reports it on **`seo` only**. `dev` and `main` are both 0 commits
ahead of `origin`.

Two related traps, recorded because both cost real time:

- **Push with `origin`, not `Cavallo`.** Three remotes point at the same GitHub repo. `Cavallo` is SSH
  and its auth is broken, so its remote-tracking refs are frozen at 2026-07-09. Branches that still
  track it (`main`, `performance`, `pr/84`, `pr/95`) report phantom "ahead" counts — `main` claimed 25
  unpushed commits that were pushed weeks earlier. Always `git fetch origin` and compare against
  `origin/<branch>`.
- **Pushing `seo` deploys immediately.** `deploy-seo.yml` triggers on push and rsyncs to
  cavallo.seo.markroberts.io with no staging step. Commit freely, but never push without approval.

Recorded in `AGENTS.md`, in `config.ts` at the point of use, and in project memory as
`cavallo-repo-boundaries`.

## 2026-08-11 — Query-level GSC shows the laminitis cluster cannibalizes itself commercially

Search Console's `query` dimension was pulled for the laminitis cluster for the first time. It
contradicts the premise behind the educational/commercial split recorded in
`docs/seo/cavallo-seo-pillar-project.md`.

| Page | 12mo clicks | Attributable | Commercial | Informational |
|---|---|---|---|---|
| `/your-cavallo-laminitis-healing-plan/` — the "educational" canonical | 597 | 112 | **105 (94%)** | **7** |
| `/faq/cavallo-hoof-boots-for-laminitis/` — the commercial page | 484 | 154 | 143 | 11 |
| `/cavallo-laminitis-guide/hoof-rehab-page/` — no role in `pages.csv` | 202 | 107 | **107 (100%)** | 0 |

All three rank positions 2–15 on the *same* boot queries — "cavallo boots for laminitis", "horse
boots for laminitis", "hoof boots for laminitis", "laminitis boots", "boots for laminitic horses".
Google anonymises long-tail queries so only ~19–30% of clicks are attributable; the split within that
share is unambiguous.

Two consequences:

1. **The educational cluster is owned by nobody** — 7 clicks across 3,290 impressions. The 8,841-word
   guide built on `seo` targets genuinely uncontested ground. That is upside, not consolidation.
2. **Keeping the commercial FAQ page separate still holds, but the earlier justification was wrong.**
   It was recorded as "different search intent." The canonical is commercial in practice. The real
   reason is that the FAQ page is the best-positioned home for the commercial cluster once the
   canonical goes fully educational.

Method note: `lib/gsc.ts` has no query dimension and `state/gsc.json` is page-level only, which is why
this went unseen for months. Pulled with a throwaway read-only script. Worth promoting into
`scripts/` — `state/next-actions.md` item 1 has an open question of exactly this kind (the
`/how-to-measure/` pair).

Full evidence: `docs/laminitis-task-audit-2026-08-11.md`.

## 2026-08-11 — A commercial laminitis page will be built; slug and migration not yet locked

Mark's direction, on the finding above: the cluster splits into two pages, one per intent, and the
commercial page needs creating. The educational half already exists on `seo`.

**Decided:** two pages, not one. `/your-cavallo-laminitis-healing-plan/` stays educational; a separate
commercial page owns the "boots for laminitis" cluster.

**Not yet locked, deliberately:** the commercial slug (`/hoof-boots-for-laminitis/` is the
recommendation and is free on both production and staging), and whether the existing FAQ page is
301'd into it or expanded in place. Recommended path is a new page with the FAQ page 301'd in once the
new page is live — `/faq/…` is a custom post type and fights a product-grid template. The condition on
that path: **leaving the FAQ page live alongside a new commercial page creates a fourth competitor and
is worse than doing nothing.**

`state/pages.csv` is unchanged. Re-roling `/faq/cavallo-hoof-boots-for-laminitis/` from KEEP-SPOKE to
MERGE+301 is a Step 3 human-review decision, recorded in `next-actions.md` item 2 step 3, not written
by a script.

Also recorded on 2026-08-11, from Mark: folding merge-source copy into the guide does not matter for
ranking signal, since a 301 passes equity regardless. If the fold-in is skipped, 23 MERGE+301 rows
become de facto PRUNEs — noted here so the map and reality do not silently diverge.

## 2026-08-13/14 — Saddle Pads and Pro-Flex Splint Boots are both being discontinued

Two product lines are going away, confirmed by Mark on two different days during the Phase 3 shop-nav
work: Saddle Pads (2026-08-13) and Pro-Flex Splint Boots (2026-08-14). Both are removed from every new
nav/homepage/hub design — see `docs/superpowers/specs/2026-08-13-shop-nav-restructure-design.md` and
the two companion docs in `docs/`.

Neither line's live pages are touched by this decision yet. `/product-category/saddle-pads/` (12,403
combined GA4 views/12mo) and `/product-category/pro-flex-splint-boots/` (1,056 GA4 views/12mo) still
exist and still earn real traffic — each needs its own disposition-map treatment (PRUNE/301, handling
support for prior buyers) once the actual catalog discontinuation executes, on its own timeline. That
is a separate catalog decision, not scoped here.
